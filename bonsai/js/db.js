// Camada de Persistência Offline-First (IndexedDB) + Kit Demonstração Comercial + Backup JSON
window.BonsaiDB = (function () {
  const DB_NAME = 'BonsaiMoriDB';
  const DB_VERSION = 1;

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('trees')) {
          const treeStore = db.createObjectStore('trees', { keyPath: 'id' });
          treeStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('logs')) {
          const logStore = db.createObjectStore('logs', { keyPath: 'id' });
          logStore.createIndex('treeId', 'treeId', { unique: false });
          logStore.createIndex('date', 'date', { unique: false });
        }
        if (!db.objectStoreNames.contains('photos')) {
          const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
          photoStore.createIndex('treeId', 'treeId', { unique: false });
          photoStore.createIndex('date', 'date', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
    return dbPromise;
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function localDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + (daysOffset || 0));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  async function txExec(storeName, mode, fn) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      let result;
      try {
        result = fn(store, tx);
      } catch (err) {
        reject(err);
        return;
      }
      tx.oncomplete = () => resolve(result && result.result !== undefined ? result.result : result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function getById(storeName, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function getByIndex(storeName, indexName, val) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const idx = tx.objectStore(storeName).index(indexName);
      const req = idx.getAll(val);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function putItem(storeName, item) {
    return txExec(storeName, 'readwrite', (store) => store.put(item));
  }

  async function deleteItem(storeName, id) {
    return txExec(storeName, 'readwrite', (store) => store.delete(id));
  }

  async function saveTree(treeData) {
    const now = new Date().toISOString();
    const tree = Object.assign(
      {
        id: uid('tree'),
        createdAt: now
      },
      treeData,
      { updatedAt: now }
    );
    await putItem('trees', tree);
    return tree;
  }

  async function deleteTreeCascade(treeId) {
    const logs = await getByIndex('logs', 'treeId', treeId);
    const photos = await getByIndex('photos', 'treeId', treeId);
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['trees', 'logs', 'photos'], 'readwrite');
      tx.objectStore('trees').delete(treeId);
      const logStore = tx.objectStore('logs');
      logs.forEach((l) => logStore.delete(l.id));
      const photoStore = tx.objectStore('photos');
      photos.forEach((p) => photoStore.delete(p.id));
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearAllBenchData() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['trees', 'logs', 'photos'], 'readwrite');
      tx.objectStore('trees').clear();
      tx.objectStore('logs').clear();
      tx.objectStore('photos').clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function addPhoto(photoObj) {
    const item = Object.assign(
      {
        id: uid('photo'),
        date: localDateOffset(0),
        angle: 'Frente',
        caption: '',
        createdAt: new Date().toISOString()
      },
      photoObj
    );
    await putItem('photos', item);

    if (photoObj.setAsCover || photoObj.autoCover) {
      const tree = await getById('trees', item.treeId);
      if (tree && (photoObj.setAsCover || !tree.coverPhoto)) {
        tree.coverPhoto = item.dataUrl;
        tree.updatedAt = new Date().toISOString();
        await putItem('trees', tree);
      }
    }
    return item;
  }

  async function deletePhoto(photoId) {
    const photo = await getById('photos', photoId);
    if (!photo) return;
    await deleteItem('photos', photoId);
    const tree = await getById('trees', photo.treeId);
    if (tree && tree.coverPhoto === photo.dataUrl) {
      const remaining = await getByIndex('photos', 'treeId', tree.id);
      remaining.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      tree.coverPhoto = remaining.length > 0 ? remaining[0].dataUrl : null;
      await putItem('trees', tree);
    }
  }

  async function addLog(logObj) {
    const nowIso = new Date().toISOString();
    const log = Object.assign(
      {
        id: uid('log'),
        date: localDateOffset(0),
        createdAt: nowIso
      },
      logObj
    );
    await putItem('logs', log);

    const tree = await getById('trees', log.treeId);
    if (tree) {
      if (log.type === 'rega') {
        tree.lastWateredAt = log.date;
      } else if (log.type === 'adubacao') {
        tree.lastFertilizedAt = log.date;
      } else if (log.type === 'transplante') {
        tree.lastRepottedAt = log.date;
        if (log.newSubstrate) tree.substrate = log.newSubstrate;
      } else if (log.type === 'aramacao') {
        tree.activeWire = {
          appliedAt: log.date,
          checkDays: Number(log.wireCheckDays) || 45,
          gauge: log.wireGauge || '',
          notes: log.notes || ''
        };
      } else if (log.type === 'desaramacao') {
        tree.activeWire = null;
      }
      tree.updatedAt = nowIso;
      await putItem('trees', tree);
    }
    return log;
  }

  async function deleteLog(logId) {
    return deleteItem('logs', logId);
  }

  function compressImageFile(file, maxDimension, quality) {
    const maxDim = maxDimension || 1280;
    const qual = quality || 0.82;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
      reader.onload = (ev) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Formato de imagem inválido.'));
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', qual));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Renderizador vetorial para fotos de demonstração Antes vs Depois
  function renderDemoIllustration(stage) {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 540);
    grad.addColorStop(0, '#16291e');
    grad.addColorStop(1, '#0d1811');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 720, 540);

    ctx.fillStyle = '#241a14';
    ctx.fillRect(0, 445, 720, 95);

    ctx.fillStyle = stage === 'before' ? '#6b4c3a' : '#2c4d63';
    ctx.beginPath();
    ctx.moveTo(220, 385);
    ctx.lineTo(500, 385);
    ctx.lineTo(470, 445);
    ctx.lineTo(250, 445);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#8b6244';
    ctx.lineCap = 'round';
    ctx.lineWidth = stage === 'before' ? 22 : 36;
    ctx.beginPath();
    ctx.moveTo(360, 385);
    ctx.bezierCurveTo(310, 310, 405, 245, 355, 165);
    ctx.stroke();

    ctx.lineWidth = stage === 'before' ? 9 : 14;
    ctx.beginPath();
    ctx.moveTo(340, 290);
    ctx.lineTo(245, 255);
    ctx.moveTo(375, 235);
    ctx.lineTo(475, 205);
    ctx.stroke();

    if (stage === 'before') {
      ctx.fillStyle = '#3d7a4f';
      ctx.beginPath();
      ctx.arc(245, 245, 45, 0, Math.PI * 2);
      ctx.arc(470, 198, 42, 0, Math.PI * 2);
      ctx.arc(355, 145, 62, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const pads = [
        [235, 250, 78, 28],
        [480, 200, 82, 28],
        [305, 175, 65, 24],
        [360, 130, 108, 38]
      ];
      pads.forEach(([x, y, rx, ry]) => {
        ctx.fillStyle = '#2d6e42';
        ctx.beginPath();
        ctx.ellipse(x, y + 6, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#55b371';
        ctx.beginPath();
        ctx.ellipse(x, y, rx * 0.9, ry * 0.82, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillText(stage === 'before' ? 'ANTES • Pré-Bonsai em Vaso de Treino' : 'DEPOIS • Patamares Refinados em Cerâmica', 24, 40);

    return canvas.toDataURL('image/jpeg', 0.86);
  }

  // Kit Comercial de Demonstração (3 árvores ricas para amigos/clientes avaliarem o app)
  async function seedCommercialDemoPack() {
    const beforeImg = renderDemoIllustration('before');
    const afterImg = renderDemoIllustration('after');

    const t1 = await saveTree({
      name: 'Jabuticabeira Sabará (Demo)',
      speciesId: 'jabuticabeira',
      scientificName: 'Plinia cauliflora',
      bench: 'Bancada Frutíferas',
      styleId: 'moyogi',
      stageId: 'formado',
      estimatedAgeYears: 12,
      heightCm: 38,
      nebariCm: 9.5,
      potType: 'Oval esmaltado azul (28 cm)',
      substrate: '60% Caqueira / 30% Casca Pinus / 10% Carvão moído',
      waterIntervalDays: 1,
      fertilizerIntervalDays: 30,
      repotIntervalYears: 2,
      lastWateredAt: localDateOffset(-1),
      lastFertilizedAt: localDateOffset(-22),
      lastRepottedAt: localDateOffset(-410),
      coverPhoto: afterImg,
      notes: 'Abra esta ficha para testar o comparador deslizante Antes vs. Depois!'
    });

    await addPhoto({
      treeId: t1.id,
      date: localDateOffset(-540),
      angle: 'Frente',
      caption: 'Estruturação inicial em vaso de treinamento.',
      dataUrl: beforeImg
    });

    await addPhoto({
      treeId: t1.id,
      date: localDateOffset(-5),
      angle: 'Frente',
      caption: 'Após 18 meses de ramificação secundária e transplante para cerâmica.',
      dataUrl: afterImg,
      setAsCover: true
    });

    await addLog({
      treeId: t1.id,
      type: 'adubacao',
      date: localDateOffset(-22),
      title: 'Adubação orgânica Bokashi',
      product: 'Bokashi em porta-adubo',
      notes: '4 sachês distribuídos nas bordas do vaso.'
    });

    await saveTree({
      name: 'Junípero Jacaré Semi-Cascata (Demo)',
      speciesId: 'junipero-jacare',
      scientificName: 'Juniperus horizontalis',
      bench: 'Bancada Coníferas',
      styleId: 'han-kengai',
      stageId: 'formado',
      estimatedAgeYears: 9,
      heightCm: 26,
      nebariCm: 6.0,
      potType: 'Tambor não-esmaltado terracota',
      substrate: '50% Akadama / 30% Púmice / 20% Pedrisco',
      waterIntervalDays: 2,
      fertilizerIntervalDays: 45,
      repotIntervalYears: 3,
      lastWateredAt: localDateOffset(0),
      lastFertilizedAt: localDateOffset(-30),
      lastRepottedAt: localDateOffset(-600),
      activeWire: {
        appliedAt: localDateOffset(-72),
        checkDays: 80,
        gauge: 'Cobre recozido 2.0mm',
        notes: 'Abaixamento do patamar cascata principal.'
      },
      notes: 'Exemplar com alerta de revisão de aramação próximo do limite para demonstrar o monitor anti-marca.'
    });

    await saveTree({
      name: 'Rosa-do-deserto Caudiciforme (Demo)',
      speciesId: 'rosa-do-deserto',
      scientificName: 'Adenium obesum',
      bench: 'Bancada Caudiciformes & Rocha',
      styleId: 'caudiciforme',
      stageId: 'formado',
      estimatedAgeYears: 6,
      heightCm: 29,
      nebariCm: 14.0,
      potType: 'Bandeja rasa cerâmica',
      substrate: '60% Pedrisco / 25% Areia grossa / 15% Carvão',
      waterIntervalDays: 4,
      fertilizerIntervalDays: 45,
      repotIntervalYears: 2,
      lastWateredAt: localDateOffset(-2),
      lastFertilizedAt: localDateOffset(-20),
      lastRepottedAt: localDateOffset(-320),
      notes: 'Rega espaçada a cada 4 dias; selar qualquer poda imediatamente com cola instantânea ou canela.'
    });

    return 3;
  }

  // Acervo Completo das 23 Espécies Pessoais (B-001 a B-023)
  function buildPersonalAcervoTemplates() {
    return [
      { code: 'B-001', name: 'B-001 • Acerola', speciesId: 'acerola', scientificName: 'Malpighia emarginata', bench: 'Bancada Frutíferas', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-20), lastRepottedAt: localDateOffset(-420), notes: 'Excelente resposta à poda. Manter sol pleno para estimular botões florais e frutificação.' },
      { code: 'B-002', name: 'B-002 • Amora (Amoreira-preta)', speciesId: 'amora', scientificName: 'Morus nigra', bench: 'Bancada Sol Pleno A', styleId: 'pre-bonsai', stageId: 'pre-bonsai', potType: 'Vaso de Treino', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 1.5, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-15), lastRepottedAt: localDateOffset(-240), notes: 'Crescimento explosivo. Exige rega constante e desfolha seletiva no verão para diminuir folhas.' },
      { code: 'B-003', name: 'B-003 • Buxinho', speciesId: 'buxinho', scientificName: 'Buxus sempervirens', bench: 'Bancada Meia-Sombra', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '40% Caqueira / 30% Cacos Cerâmicos / 30% Terra Vegetal', waterIntervalDays: 2, fertilizerIntervalDays: 45, repotIntervalYears: 3, lastWateredAt: localDateOffset(-1), lastFertilizedAt: localDateOffset(-40), lastRepottedAt: localDateOffset(-660), notes: 'Madeira densa e crescimento lento; não desfolhar totalmente. Aramação cuidadosa com proteção.' },
      { code: 'B-004', name: 'B-004 • Caliandra-rosa (Esponjinha)', speciesId: 'caliandra-rosa', scientificName: 'Calliandra brevipes', bench: 'Bancada Sol Pleno A', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-12), lastRepottedAt: localDateOffset(-540), notes: 'Floração em pompons róseos. Ramos secam se podados sem gema ativa; aramar só brotos verdes.' },
      { code: 'B-005', name: 'B-005 • Caliandra-vermelha', speciesId: 'caliandra-vermelha', scientificName: 'Calliandra tweedii', bench: 'Bancada Sol Pleno A', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-25), lastRepottedAt: localDateOffset(-480), notes: 'Exige sol pleno constante para florescer. Folhas fecham à noite e sob frio/seca.' },
      { code: 'B-006', name: 'B-006 • Duranta (Pingo-de-ouro)', speciesId: 'duranta', scientificName: 'Duranta erecta', bench: 'Bancada Sol Pleno B', styleId: 'pre-bonsai', stageId: 'pre-bonsai', potType: 'Vaso de Treino', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 1.5, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-10), lastRepottedAt: localDateOffset(-300), notes: 'Espinhos nos ramos juvenis. Grande flexibilidade e velocidade para formar patamares.' },
      { code: 'B-007', name: 'B-007 • Érica-falsa / Cufea', speciesId: 'erica-falsa', scientificName: 'Cuphea gracilis', bench: 'Bancada Mame & Shohin', styleId: 'shohin', stageId: 'formado', potType: 'Vaso Cerâmica Shohin', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 1.5, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-14), lastRepottedAt: localDateOffset(-360), notes: 'Floração rosa contínua o ano todo. Substrato úmido sem encharcar; porte Shohin gracioso.' },
      { code: 'B-008', name: 'B-008 • Figueira-benjamim (Fícus)', speciesId: 'figueira-benjamim', scientificName: 'Ficus benjamina', bench: 'Bancada Sol Pleno B', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(-1), lastFertilizedAt: localDateOffset(-18), lastRepottedAt: localDateOffset(-420), notes: 'Látex abundante; vigor incrível no verão tropical. Excelente fusão de troncos e raízes sobre rocha.' },
      { code: 'B-009', name: 'B-009 • Fruta-dos-milagres', speciesId: 'fruta-dos-milagres', scientificName: 'Synsepalum dulcificum', bench: 'Bancada Meia-Sombra', styleId: 'pre-bonsai', stageId: 'pre-bonsai', potType: 'Vaso de Treino', substrate: '50% Terra Vegetal Ácida / 30% Caqueira / 20% Casca Pinus', waterIntervalDays: 1, fertilizerIntervalDays: 45, repotIntervalYears: 2.5, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-35), lastRepottedAt: localDateOffset(-600), notes: 'Exige pH ácido (4.5 a 5.8). Regar apenas com água desclorada; folhas sensíveis a calcário.' },
      { code: 'B-010', name: 'B-010 • Ixora (Mini-ixora)', speciesId: 'ixora', scientificName: 'Ixora coccinea compacta', bench: 'Bancada Mame & Shohin', styleId: 'shohin', stageId: 'formado', potType: 'Vaso Cerâmica Shohin', substrate: '50% Caqueira / 30% Terra Vegetal / 20% Casca Pinus', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-22), lastRepottedAt: localDateOffset(-450), notes: 'Flores em buquê denso. Proteger de ventos frios abaixo de 12°C no inverno.' },
      { code: 'B-011', name: 'B-011 • Jabuticaba (Sabará / Híbrida)', speciesId: 'jabuticabeira', scientificName: 'Plinia cauliflora', bench: 'Bancada Frutíferas', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-36), lastRepottedAt: localDateOffset(-540), notes: 'Tronco descascando uniforme com belo aspecto marmorizado; manter alta hidratação no verão.' },
      { code: 'B-012', name: 'B-012 • Junípero Jacaré', speciesId: 'junipero-jacare', scientificName: 'Juniperus horizontalis', bench: 'Bancada Coníferas', styleId: 'han-kengai', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '50% Akadama / 30% Púmice / 20% Rocha Vulcânica', waterIntervalDays: 2, fertilizerIntervalDays: 45, repotIntervalYears: 3, lastWateredAt: localDateOffset(-1), lastFertilizedAt: localDateOffset(-48), lastRepottedAt: localDateOffset(-780), activeWire: { appliedAt: localDateOffset(-60), checkDays: 80, gauge: 'Cobre 2.0mm', notes: 'Aramação do galho cascata e ajuste de tensores.' }, notes: 'Estilo Han-Kengai (semi-cascata). Shari natural na curva principal tratado com calda sulfocálcica.' },
      { code: 'B-013', name: 'B-013 • Limão-cravo (Limão-rosa)', speciesId: 'limao-cravo', scientificName: 'Citrus × limonia', bench: 'Bancada Frutíferas', styleId: 'pre-bonsai', stageId: 'pre-bonsai', potType: 'Vaso de Treino', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-16), lastRepottedAt: localDateOffset(-330), notes: 'Frutos perfumados. Vigiar cochonilhas de carapaça e minador-dos-citros; aplicar óleo de neem.' },
      { code: 'B-014', name: 'B-014 • Mexerica Ponkan', speciesId: 'mexerica-ponkan', scientificName: 'Citrus reticulata', bench: 'Bancada Frutíferas', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-24), lastRepottedAt: localDateOffset(-570), notes: 'Aroma cítrico intenso. Condução em estilo ereto informal (Moyogi) com copa cônica.' },
      { code: 'B-015', name: 'B-015 • Pau-ferro (Jucá)', speciesId: 'pau-ferro', scientificName: 'Libidibia ferrea', bench: 'Bancada Nativas Sol Pleno', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-26), lastRepottedAt: localDateOffset(-510), notes: 'Casca descamante marmorizada verde e cinza espetacular. Folíolos fecham ao entardecer.' },
      { code: 'B-016', name: 'B-016 • Pitanga', speciesId: 'pitangueira', scientificName: 'Eugenia uniflora', bench: 'Bancada Frutíferas', styleId: 'moyogi', stageId: 'formado', nebariCm: 12, potType: 'Vaso Cerâmica', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 1.5, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-18), lastRepottedAt: localDateOffset(-300), notes: 'Tronco canelado com belo nebari de 12 cm. Brotações novas nascem em tom rubro intenso.' },
      { code: 'B-017', name: 'B-017 • Piteco / Tataré', speciesId: 'piteco', scientificName: 'Chloroleucon tortum', bench: 'Bancada Nativas Sol Pleno', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-14), lastRepottedAt: localDateOffset(-390), notes: 'Madeira extremamente contorcida e casca lisa em tons claros. Cicatriza cortes com facilidade.' },
      { code: 'B-018', name: 'B-018 • Piteco-cortiçoso (Jurema-branca)', speciesId: 'piteco-corticoso', scientificName: 'Chloroleucon mangense', bench: 'Bancada Nativas Sol Pleno', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco', waterIntervalDays: 2, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(-1), lastFertilizedAt: localDateOffset(-28), lastRepottedAt: localDateOffset(-480), notes: 'Casca suberosa (cortiça grossa) com fissuras profundas de árvore anciã. Altíssima rusticidade.' },
      { code: 'B-019', name: 'B-019 • Primavera (Buganvília)', speciesId: 'bougainvillea', scientificName: 'Bougainvillea spectabilis', bench: 'Bancada Sol Pleno B', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco', waterIntervalDays: 2, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(-1), lastFertilizedAt: localDateOffset(-27), lastRepottedAt: localDateOffset(-450), notes: 'Brácteas magenta intensas. Raízes frágeis como giz no transplante: nunca desmanchar o torrão à força.' },
      { code: 'B-020', name: 'B-020 • Rainha-do-abismo ("Seeninja")', speciesId: 'rainha-do-abismo', scientificName: 'Sinningia leucotricha', bench: 'Bancada Caudiciformes & Rocha', styleId: 'sekijoju', stageId: 'formado', potType: 'Laje de Ardósia Natural', substrate: '60% Pedrisco / 20% Cacos Cerâmicos / 20% Terra Vegetal', waterIntervalDays: 4, fertilizerIntervalDays: 45, repotIntervalYears: 3, lastWateredAt: localDateOffset(-2), lastFertilizedAt: localDateOffset(-42), lastRepottedAt: localDateOffset(-720), notes: 'Cáudice tuberoso lanoso prateado rupícola montado sobre placa de ardósia. Suspender regas na dormência.' },
      { code: 'B-021', name: 'B-021 • Rosa-do-deserto', speciesId: 'rosa-do-deserto', scientificName: 'Adenium obesum', bench: 'Bancada Caudiciformes & Rocha', styleId: 'caudiciforme', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '60% Pedrisco / 20% Cacos Cerâmicos / 20% Terra Vegetal', waterIntervalDays: 4, fertilizerIntervalDays: 45, repotIntervalYears: 2, lastWateredAt: localDateOffset(-2), lastFertilizedAt: localDateOffset(-32), lastRepottedAt: localDateOffset(-540), notes: 'Cáudice basal escultural largo. Substrato de secagem ultra rápida; tolerância zero a encharcamento.' },
      { code: 'B-022', name: 'B-022 • Serissa variegata', speciesId: 'serissa-variegata', scientificName: 'Serissa japonica "Variegata"', bench: 'Bancada Mame & Shohin', styleId: 'shohin', stageId: 'formado', potType: 'Vaso Cerâmica Shohin', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 1, fertilizerIntervalDays: 30, repotIntervalYears: 1.5, lastWateredAt: localDateOffset(0), lastFertilizedAt: localDateOffset(-17), lastRepottedAt: localDateOffset(-330), notes: 'Flores brancas estreladas delicadas. Manter em local fixo sem oscilações bruscas de microclima.' },
      { code: 'B-023', name: 'B-023 • Tamarindo', speciesId: 'tamarindo', scientificName: 'Tamarindus indica', bench: 'Bancada Sol Pleno B', styleId: 'moyogi', stageId: 'formado', potType: 'Vaso Cerâmica', substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco', waterIntervalDays: 2, fertilizerIntervalDays: 30, repotIntervalYears: 2, lastWateredAt: localDateOffset(-1), lastFertilizedAt: localDateOffset(-21), lastRepottedAt: localDateOffset(-450), notes: 'Folhagem pinada leve que recolhe à noite. Tronco áspero de rápida lignificação.' }
    ];
  }

  async function syncPersonalCollection() {
    const existing = await getAll('trees');
    const templates = buildPersonalAcervoTemplates();
    let added = 0;

    for (let i = 0; i < templates.length; i++) {
      const tpl = templates[i];
      const found = existing.some(
        (t) => t.speciesId === tpl.speciesId || (t.code && t.code === tpl.code)
      );
      if (!found) {
        const ts = new Date(Date.now() - (templates.length - i) * 1000).toISOString();
        await putItem('trees', Object.assign({
          id: 'acervo_' + tpl.code.toLowerCase(),
          createdAt: ts,
          updatedAt: ts
        }, tpl));
        added++;
      }
    }
    return added;
  }

  async function exportFullBackup() {
    const [trees, logs, photos] = await Promise.all([
      getAll('trees'),
      getAll('logs'),
      getAll('photos')
    ]);
    const lic = window.BonsaiLicense ? window.BonsaiLicense.loadStoredLicense() : null;
    return {
      app: 'Bonsai Mori',
      version: 2,
      exportedAt: new Date().toISOString(),
      license: lic || null,
      trees,
      logs,
      photos
    };
  }

  async function importFullBackup(payload) {
    if (!payload || !Array.isArray(payload.trees)) {
      throw new Error('Arquivo de backup inválido.');
    }
    if (payload.license && payload.license.email && payload.license.key && window.BonsaiLicense) {
      window.BonsaiLicense.activateLicense(payload.license.email, payload.license.key);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['trees', 'logs', 'photos'], 'readwrite');
      const tStore = tx.objectStore('trees');
      const lStore = tx.objectStore('logs');
      const pStore = tx.objectStore('photos');

      payload.trees.forEach((t) => tStore.put(t));
      (payload.logs || []).forEach((l) => lStore.put(l));
      (payload.photos || []).forEach((p) => pStore.put(p));

      tx.oncomplete = () => resolve({
        trees: payload.trees.length,
        logs: (payload.logs || []).length,
        photos: (payload.photos || []).length
      });
      tx.onerror = () => reject(tx.error);
    });
  }

  return {
    uid,
    getAll,
    getById,
    getByIndex,
    saveTree,
    deleteTreeCascade,
    clearAllBenchData,
    addPhoto,
    deletePhoto,
    addLog,
    deleteLog,
    compressImageFile,
    seedCommercialDemoPack,
    syncPersonalCollection,
    exportFullBackup,
    importFullBackup
  };
})();
