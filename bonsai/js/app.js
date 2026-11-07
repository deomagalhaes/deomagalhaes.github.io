// Controlador Principal SPA Comercial — Bonsai Hub PRO
(function () {
  const Botany = window.BonsaiBotany;
  const DB = window.BonsaiDB;
  const License = window.BonsaiLicense;

  let state = {
    trees: [],
    logs: [],
    photos: [],
    activeTab: 'trees',
    selectedTreeId: null,
    editingTreeId: null,
    treeSearch: '',
    benchFilter: 'ALL',
    guideSearch: '',
    guideScope: 'all',
    deferredInstallPrompt: null
  };

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function parseYMD(str) {
    if (!str) return null;
    const parts = str.split('-');
    if (parts.length !== 3) return new Date(str);
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
  }

  function daysSince(dateStr) {
    if (!dateStr) return null;
    const past = parseYMD(dateStr);
    const now = parseYMD(todayStr());
    if (!past || isNaN(past.getTime())) return null;
    return Math.max(0, Math.round((now - past) / 86400000));
  }

  function formatDateBR(dateStr) {
    if (!dateStr) return 'Não registrado';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg) {
    const el = document.getElementById('app-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function openPaywall(reasonMsg) {
    const txt = document.getElementById('paywall-reason-txt');
    if (txt) txt.textContent = reasonMsg || 'Desbloqueie recursos ilimitados com a Licença Vitalícia PRO.';
    document.getElementById('modal-paywall').classList.add('open');
  }

  function renderHeaderLicenseBadge() {
    const btn = document.getElementById('btn-pro-status');
    if (!btn) return;
    const summary = License.getStatusSummary();
    btn.textContent = summary.badgeText;
  }

  function computeTreeAlerts(tree) {
    const alerts = [];
    const waterInterval = Number(tree.waterIntervalDays) || 1;
    const dWater = daysSince(tree.lastWateredAt);

    if (dWater === null || dWater >= waterInterval) {
      alerts.push({
        kind: 'water',
        severity: dWater !== null && dWater > waterInterval ? 'urgent' : 'water',
        treeId: tree.id,
        treeName: tree.name,
        title: dWater === null ? 'Primeira rega pendente' : 'Verificar rega (' + dWater + 'd sem registro)',
        subtitle: (tree.bench ? tree.bench + ' • ' : '') + 'Ciclo: a cada ' + waterInterval + ' dia(s)'
      });
    }

    if (tree.activeWire && tree.activeWire.appliedAt) {
      const dWire = daysSince(tree.activeWire.appliedAt) || 0;
      const limit = Number(tree.activeWire.checkDays) || 45;
      const ratio = dWire / limit;
      if (ratio >= 0.75) {
        alerts.push({
          kind: 'wire',
          severity: ratio >= 1 ? 'urgent' : 'warning',
          treeId: tree.id,
          treeName: tree.name,
          title: ratio >= 1
            ? '⚠️ Risco de marca de arame (' + dWire + '/' + limit + 'd)'
            : 'Inspecionar aramação (' + dWire + '/' + limit + 'd)',
          subtitle: tree.activeWire.gauge ? 'Bitola: ' + tree.activeWire.gauge : 'Verificar pressão na casca'
        });
      }
    }

    const fertInterval = Number(tree.fertilizerIntervalDays) || 30;
    const dFert = daysSince(tree.lastFertilizedAt);
    if (dFert !== null && dFert >= fertInterval) {
      alerts.push({
        kind: 'fertilizer',
        severity: 'warning',
        treeId: tree.id,
        treeName: tree.name,
        title: 'Renovar adubação (' + dFert + 'd)',
        subtitle: 'Ciclo programado: a cada ' + fertInterval + ' dias'
      });
    }

    const repotYears = Number(tree.repotIntervalYears) || 2;
    const dRepot = daysSince(tree.lastRepottedAt);
    if (dRepot !== null && dRepot >= Math.round(repotYears * 365)) {
      alerts.push({
        kind: 'repot',
        severity: 'warning',
        treeId: tree.id,
        treeName: tree.name,
        title: 'Avaliar transplante de raízes',
        subtitle: 'Último há ' + Math.floor(dRepot / 30) + ' meses'
      });
    }

    return alerts;
  }

  async function refreshData() {
    const [trees, logs, photos] = await Promise.all([
      DB.getAll('trees'),
      DB.getAll('logs'),
      DB.getAll('photos')
    ]);
    trees.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR', { numeric: true }));
    logs.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
    photos.sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.createdAt || '').localeCompare(b.createdAt || ''));

    state.trees = trees;
    state.logs = logs;
    state.photos = photos;
    renderAll();
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    if (tabId !== 'detail') {
      state.selectedTreeId = null;
    }
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.toggle('active', p.id === 'tab-' + tabId);
    });
    document.querySelectorAll('.nav-item').forEach((btn) => {
      const target = btn.getAttribute('data-tab');
      btn.classList.toggle('active', target === tabId || (tabId === 'detail' && target === 'trees'));
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderAll();
  }

  function openTreeDetail(treeId) {
    state.selectedTreeId = treeId;
    state.activeTab = 'detail';
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.toggle('active', p.id === 'tab-detail');
    });
    renderTreeDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ABA 1: MINHA BANCADA
  function renderTreesTab() {
    const season = Botany.getCurrentSeasonInfo();
    const bannerEl = document.getElementById('season-banner-box');
    if (bannerEl) {
      bannerEl.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px;">' +
          '<span class="season-badge" style="margin:0;">' + esc(season.badge) + '</span>' +
          '<span style="font-size:0.74rem;color:var(--accent-gold);font-weight:600;">' + esc(season.moonPhase) + '</span>' +
        '</div>' +
        '<h2 class="season-title">' + esc(season.name) + '</h2>' +
        '<p class="season-summary">' + esc(season.summary) + '</p>';
    }

    const allAlerts = [];
    let wiredCount = 0;
    let thirstyCount = 0;
    state.trees.forEach((t) => {
      if (t.activeWire) wiredCount++;
      const alerts = computeTreeAlerts(t);
      alerts.forEach((a) => {
        allAlerts.push(a);
        if (a.kind === 'water') thirstyCount++;
      });
    });

    const statsEl = document.getElementById('dashboard-stats');
    if (statsEl) {
      statsEl.innerHTML =
        '<div class="stat-card">' +
          '<span class="stat-num ok">' + state.trees.length + '</span>' +
          '<span class="stat-label">Exemplares</span>' +
        '</div>' +
        '<div class="stat-card">' +
          '<span class="stat-num ' + (allAlerts.length > 0 ? 'warn' : 'ok') + '">' + allAlerts.length + '</span>' +
          '<span class="stat-label">Alertas Hoje</span>' +
        '</div>' +
        '<div class="stat-card">' +
          '<span class="stat-num">' + wiredCount + '</span>' +
          '<span class="stat-label">Aramadas</span>' +
        '</div>';
    }

    const benches = Array.from(new Set(state.trees.map((t) => t.bench).filter(Boolean))).sort();
    const pillsEl = document.getElementById('bench-filter-pills');
    const searchWrap = document.querySelector('#tab-trees .search-box');
    if (searchWrap) searchWrap.style.display = state.trees.length > 0 ? 'block' : 'none';
    if (pillsEl) {
      pillsEl.style.display = state.trees.length > 0 ? 'flex' : 'none';
      const items = [
        { id: 'ALL', label: 'Todas (' + state.trees.length + ')' },
        { id: 'WATER_DUE', label: '💧 Regar (' + thirstyCount + ')' }
      ].concat(benches.map((b) => ({ id: b, label: b.replace('Bancada ', '') })));

      pillsEl.innerHTML = items.map((it) =>
        '<button type="button" class="pill-btn ' + (state.benchFilter === it.id ? 'active' : '') + '" data-bench-pill="' + esc(it.id) + '">' +
          esc(it.label) +
        '</button>'
      ).join('');

      pillsEl.querySelectorAll('[data-bench-pill]').forEach((btn) => {
        btn.onclick = () => {
          state.benchFilter = btn.getAttribute('data-bench-pill');
          renderTreesTab();
        };
      });
    }

    const q = state.treeSearch.trim().toLowerCase();
    const filtered = state.trees.filter((t) => {
      const sp = Botany.getSpeciesById(t.speciesId);
      if (state.benchFilter === 'WATER_DUE') {
        const dw = daysSince(t.lastWateredAt);
        if (!(dw === null || dw >= (Number(t.waterIntervalDays) || 1))) return false;
      } else if (state.benchFilter !== 'ALL' && t.bench !== state.benchFilter) {
        return false;
      }
      if (!q) return true;
      const hay = [t.name, sp.commonName, t.customSpecies, t.scientificName, t.bench, t.notes].join(' ').toLowerCase();
      return hay.includes(q);
    });

    const headerTitle = document.getElementById('bench-header-title');
    if (headerTitle) {
      headerTitle.textContent = state.trees.length > 0 ? '🌳 Minha Bancada (' + filtered.length + ')' : '🌳 Bem-vindo ao Bonsai Hub';
    }

    const listEl = document.getElementById('trees-list-container');
    if (!listEl) return;

    // Onboarding Limpo para Amigos / Novos Usuários!
    if (state.trees.length === 0) {
      listEl.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-icon">🪴</div>' +
          '<h3>Sua bancada individual está pronta</h3>' +
          '<p>Seus dados ficam salvos exclusivamente neste aparelho. Comece cadastrando suas próprias árvores do zero ou carregue 3 exemplares de demonstração para testar o comparador Antes/Depois e o monitor de aramação.</p>' +
          '<div class="empty-actions">' +
            '<button class="btn btn-primary btn-block" id="btn-empty-new">+ Cadastrar Meu Primeiro Bonsai</button>' +
            '<button class="btn btn-gold btn-block" id="btn-empty-demo3">✨ Testar com 3 Bonsais de Demonstração</button>' +
          '</div>' +
        '</div>';

      document.getElementById('btn-empty-new').onclick = () => openTreeModal(null);
      document.getElementById('btn-empty-demo3').onclick = async () => {
        await DB.seedCommercialDemoPack();
        await refreshData();
        showToast('3 bonsais de demonstração carregados!');
      };
      return;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:18px 0;">Nenhuma árvore encontrada para este filtro.</p>';
      return;
    }

    listEl.innerHTML = filtered.map((t) => {
      const sp = Botany.getSpeciesById(t.speciesId);
      const spLabel = t.speciesId === 'outra' && t.customSpecies ? t.customSpecies : sp.commonName;
      const dWater = daysSince(t.lastWateredAt);
      const waterDue = dWater === null || dWater >= (Number(t.waterIntervalDays) || 1);
      const dFert = daysSince(t.lastFertilizedAt);
      const fertDue = dFert !== null && dFert >= (Number(t.fertilizerIntervalDays) || 30);

      let wireChip = '';
      if (t.activeWire && t.activeWire.appliedAt) {
        const dw = daysSince(t.activeWire.appliedAt) || 0;
        const lim = Number(t.activeWire.checkDays) || 45;
        wireChip = '<span class="chip ' + (dw >= lim * 0.75 ? 'wire-warn' : '') + '">🌀 ' + dw + '/' + lim + 'd</span>';
      }

      const waterStatusText = dWater === null
        ? 'Sem rega registrada'
        : (dWater === 0 ? '💧 Regada hoje' : 'Rega há ' + dWater + 'd');

      const thumbHtml = t.coverPhoto
        ? '<img src="' + t.coverPhoto + '" alt="' + esc(t.name) + '" class="tree-thumb">'
        : '<div class="tree-thumb">🌳</div>';

      return (
        '<div class="tree-card">' +
          '<div class="tree-card-main" data-open-tree="' + esc(t.id) + '">' +
            thumbHtml +
            '<div class="tree-meta">' +
              '<h3 class="tree-name">' + esc(t.name) + '</h3>' +
              '<p class="tree-species">' + esc(spLabel) + (t.scientificName ? ' • ' + esc(t.scientificName) : '') + '</p>' +
              '<div class="chips-row">' +
                (t.bench ? '<span class="chip">📍 ' + esc(t.bench.replace('Bancada ', '')) + '</span>' : '') +
                (waterDue ? '<span class="chip water-due">💧 Regar</span>' : '') +
                (fertDue ? '<span class="chip wire-warn">🌱 Adubar</span>' : '') +
                wireChip +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="tree-card-footer">' +
            '<span class="last-water-txt">' + esc(waterStatusText) + '</span>' +
            '<div style="display:flex;gap:6px;">' +
              '<button class="btn btn-water btn-sm" data-quick-water="' + esc(t.id) + '">💧 Reguei</button>' +
              '<button class="btn btn-secondary btn-sm" data-open-tree="' + esc(t.id) + '">Ficha →</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    listEl.querySelectorAll('[data-open-tree]').forEach((el) => {
      el.onclick = () => openTreeDetail(el.getAttribute('data-open-tree'));
    });

    listEl.querySelectorAll('[data-quick-water]').forEach((btn) => {
      btn.onclick = async (ev) => {
        ev.stopPropagation();
        const id = btn.getAttribute('data-quick-water');
        await DB.addLog({
          treeId: id,
          type: 'rega',
          date: todayStr(),
          title: 'Rega de manutenção',
          notes: ''
        });
        await refreshData();
        showToast('💧 Rega registrada!');
      };
    });
  }

  // FICHA DETALHADA DA ÁRVORE
  function renderTreeDetail() {
    const container = document.getElementById('tree-detail-container');
    if (!container) return;
    const tree = state.trees.find((t) => t.id === state.selectedTreeId);
    if (!tree) {
      switchTab('trees');
      return;
    }

    const sp = Botany.getSpeciesById(tree.speciesId);
    const spName = tree.speciesId === 'outra' && tree.customSpecies ? tree.customSpecies : sp.commonName;
    const styleObj = Botany.getStyleById(tree.styleId);
    const treePhotos = state.photos.filter((p) => p.treeId === tree.id);
    const treeLogs = state.logs.filter((l) => l.treeId === tree.id);
    const proUnlocked = License.hasProAccess();

    let wireHtml = '';
    if (tree.activeWire && tree.activeWire.appliedAt) {
      const dw = daysSince(tree.activeWire.appliedAt) || 0;
      const lim = Number(tree.activeWire.checkDays) || 45;
      const pct = Math.min(100, Math.round((dw / lim) * 100));
      wireHtml =
        '<div class="wire-monitor-box">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
            '<strong style="font-size:0.88rem;color:#fdba74;">🌀 Aramação Ativa (' + dw + ' de ' + lim + ' dias)</strong>' +
            '<button class="btn btn-secondary btn-sm" id="btn-remove-wire">Retirar Arame</button>' +
          '</div>' +
          '<div class="wire-progress-track"><div class="wire-progress-fill" style="width:' + pct + '%"></div></div>' +
          '<p style="margin:0;font-size:0.77rem;color:var(--text-secondary);">' +
            'Aplicado em ' + formatDateBR(tree.activeWire.appliedAt) +
            (tree.activeWire.gauge ? ' • ' + esc(tree.activeWire.gauge) : '') +
            (dw >= lim ? ' • <strong>Inspecione imediatamente para não marcar o córtex!</strong>' : '') +
          '</p>' +
        '</div>';
    }

    let compareHtml = '';
    if (treePhotos.length >= 2) {
      if (proUnlocked) {
        const firstPhoto = treePhotos[0];
        const latestPhoto = treePhotos[treePhotos.length - 1];
        const optionsBefore = treePhotos.map((p, idx) =>
          '<option value="' + idx + '"' + (idx === 0 ? ' selected' : '') + '>Antes: ' + formatDateBR(p.date) + ' (' + esc(p.angle) + ')</option>'
        ).join('');
        const optionsAfter = treePhotos.map((p, idx) =>
          '<option value="' + idx + '"' + (idx === treePhotos.length - 1 ? ' selected' : '') + '>Depois: ' + formatDateBR(p.date) + ' (' + esc(p.angle) + ')</option>'
        ).join('');

        compareHtml =
          '<div class="compare-card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
              '<h3 class="section-title">⚖️ Evolução Antes vs. Depois</h3>' +
              '<span style="font-size:0.72rem;color:var(--text-muted);">Arraste para comparar</span>' +
            '</div>' +
            '<div class="compare-selects">' +
              '<select id="cmp-select-before">' + optionsBefore + '</select>' +
              '<select id="cmp-select-after">' + optionsAfter + '</select>' +
            '</div>' +
            '<div class="compare-stage" id="compare-stage">' +
              '<img id="cmp-img-after" src="' + latestPhoto.dataUrl + '" alt="Depois">' +
              '<img id="cmp-img-before" class="compare-before-layer" src="' + firstPhoto.dataUrl + '" alt="Antes">' +
              '<div class="compare-divider" id="cmp-divider"></div>' +
              '<div class="compare-knob" id="cmp-knob">↔</div>' +
              '<span class="compare-tag left" id="cmp-tag-before">' + formatDateBR(firstPhoto.date) + '</span>' +
              '<span class="compare-tag right" id="cmp-tag-after">' + formatDateBR(latestPhoto.date) + '</span>' +
            '</div>' +
            '<input type="range" min="0" max="100" value="50" class="compare-range" id="cmp-slider" aria-label="Controle Antes e Depois">' +
          '</div>';
      } else {
        compareHtml =
          '<div class="pro-license-card">' +
            '<h4>🔒 Comparador Antes vs. Depois (PRO)</h4>' +
            '<p>Desbloqueie a comparação deslizante de evolução fotográfica com a Licença Vitalícia PRO.</p>' +
            '<button class="btn btn-gold btn-sm" id="btn-unlock-compare">👑 Conhecer Licença Vitalícia</button>' +
          '</div>';
      }
    }

    const speciesGuideHtml = sp.id !== 'outra'
      ? '<div class="guide-card" style="margin-bottom:15px;">' +
          '<h4>🌿 Parâmetros Fitotécnicos — ' + esc(sp.commonName) + '</h4>' +
          '<p><strong>☀️ Sol:</strong> ' + esc(sp.sun) + '</p>' +
          '<p><strong>💧 Rega:</strong> ' + esc(sp.water || '') + '</p>' +
          '<p><strong>🏺 Época de Transplante:</strong> ' + esc(sp.repotSeason || '') + ' (a cada ~' + sp.repotYears + ' anos)</p>' +
          '<p><strong>✂️ Poda:</strong> ' + esc(sp.pruningGuide || '') + '</p>' +
          '<p><strong>🌀 Aramação:</strong> ' + esc(sp.wiringGuide || '') + '</p>' +
          '<p><strong>🌱 Nutrição:</strong> ' + esc(sp.fertGuide || '') + '</p>' +
          '<p><strong>🛡️ Atenção/Sensibilidades:</strong> ' + esc(sp.sensitivities || '') + '</p>' +
        '</div>'
      : '';

    const photosHtml = treePhotos.length === 0
      ? '<p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:16px;">Nenhuma foto ainda. Tire pelo menos 2 fotos ao longo do tempo para ativar o comparador Antes/Depois!</p>'
      : '<div class="photo-grid">' + treePhotos.slice().reverse().map((p) =>
          '<div class="photo-item">' +
            '<img src="' + p.dataUrl + '" alt="Foto">' +
            '<div class="photo-item-caption">' +
              '<strong>' + formatDateBR(p.date) + '</strong> • ' + esc(p.angle) +
              (p.caption ? '<div style="color:var(--text-secondary);margin-top:2px;">' + esc(p.caption) + '</div>' : '') +
              '<div style="display:flex;gap:6px;margin-top:6px;">' +
                '<button class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:0.68rem;" data-make-cover="' + esc(p.id) + '">Capa</button>' +
                '<button class="btn btn-danger btn-sm" style="padding:4px 8px;font-size:0.68rem;" data-del-photo="' + esc(p.id) + '">Excluir</button>' +
              '</div>' +
            '</div>' +
          '</div>'
        ).join('') + '</div>';

    const logsHtml = treeLogs.length === 0
      ? '<p style="font-size:0.82rem;color:var(--text-muted);">Nenhuma intervenção registrada no diário ainda.</p>'
      : '<div class="timeline-list">' + treeLogs.map((l) => {
          const meta = Botany.getInterventionMeta(l.type);
          return (
            '<div class="timeline-item">' +
              '<div class="timeline-icon">' + meta.icon + '</div>' +
              '<div class="timeline-body">' +
                '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
                  '<h4>' + esc(l.title || meta.label) + '</h4>' +
                  '<button class="icon-btn" style="padding:2px 7px;font-size:0.7rem;" data-del-log="' + esc(l.id) + '" title="Apagar registro">✕</button>' +
                '</div>' +
                '<div class="timeline-date">' + formatDateBR(l.date) + (l.product ? ' • Ins.: ' + esc(l.product) : '') + '</div>' +
                (l.notes ? '<p class="timeline-notes">' + esc(l.notes) + '</p>' : '') +
              '</div>' +
            '</div>'
          );
        }).join('') + '</div>';

    container.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<button class="btn btn-secondary btn-sm" id="btn-back-trees">← Bancada</button>' +
        '<div style="display:flex;gap:7px;">' +
          '<button class="btn btn-secondary btn-sm" id="btn-edit-tree">✏️ Editar</button>' +
          '<button class="btn btn-danger btn-sm" id="btn-delete-tree">🗑️</button>' +
        '</div>' +
      '</div>' +

      '<div class="detail-hero">' +
        (tree.coverPhoto
          ? '<img src="' + tree.coverPhoto + '" alt="' + esc(tree.name) + '" class="detail-cover-img">'
          : '<div class="detail-cover-placeholder"><span style="font-size:2.5rem;">🌳</span><span>Toque em "📷 Foto" para fotografar</span></div>') +
        '<div style="padding:13px;">' +
          '<h2 style="margin:0 0 3px;font-size:1.2rem;">' + esc(tree.name) + '</h2>' +
          '<p style="margin:0;font-size:0.84rem;color:var(--accent-leaf);font-style:italic;">' +
            esc(spName) + (tree.scientificName ? ' (' + esc(tree.scientificName) + ')' : '') +
          '</p>' +
        '</div>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:15px;">' +
        '<button class="btn btn-primary btn-sm" id="btn-add-intervention">+ Manejo</button>' +
        '<button class="btn btn-secondary btn-sm" id="btn-quick-fert">🌱 Adubei</button>' +
        '<button class="btn btn-secondary btn-sm" id="btn-add-photo">📷 Foto</button>' +
      '</div>' +

      wireHtml +

      '<div class="specs-grid">' +
        '<div class="spec-box"><span class="spec-label">Bancada / Setor</span><span class="spec-val">' + esc(tree.bench || 'Geral') + '</span></div>' +
        '<div class="spec-box"><span class="spec-label">Estilo</span><span class="spec-val">' + esc(styleObj.name.split(' ')[0]) + '</span></div>' +
        '<div class="spec-box"><span class="spec-label">Última Adubação</span><span class="spec-val">' + formatDateBR(tree.lastFertilizedAt) + '</span></div>' +
        '<div class="spec-box"><span class="spec-label">Vaso / Base</span><span class="spec-val">' + esc(tree.potType || 'Não informado') + '</span></div>' +
        '<div class="spec-box" style="grid-column:span 2;"><span class="spec-label">Substrato Atual</span><span class="spec-val">' + esc(tree.substrate || sp.substrate) + '</span></div>' +
      '</div>' +

      (tree.notes ? '<div class="guide-card" style="margin-bottom:15px;"><h4>📝 Notas do Exemplar</h4><p>' + esc(tree.notes) + '</p></div>' : '') +

      speciesGuideHtml +
      compareHtml +

      '<div class="section-header">' +
        '<h3 class="section-title">📷 Galeria Evolutiva (' + treePhotos.length + ')</h3>' +
      '</div>' +
      photosHtml +

      '<div class="section-header">' +
        '<h3 class="section-title">📋 Histórico de Manejo (' + treeLogs.length + ')</h3>' +
      '</div>' +
      logsHtml;

    document.getElementById('btn-back-trees').onclick = () => switchTab('trees');
    document.getElementById('btn-edit-tree').onclick = () => openTreeModal(tree);
    document.getElementById('btn-delete-tree').onclick = async () => {
      if (confirm('Deseja realmente excluir "' + tree.name + '" e todo seu histórico?')) {
        await DB.deleteTreeCascade(tree.id);
        await refreshData();
        switchTab('trees');
        showToast('Árvore removida.');
      }
    };
    document.getElementById('btn-add-intervention').onclick = () => openInterventionModal(tree);
    document.getElementById('btn-quick-fert').onclick = async () => {
      await DB.addLog({
        treeId: tree.id,
        type: 'adubacao',
        date: todayStr(),
        title: 'Adubação de manutenção',
        notes: 'Ciclo renovado.'
      });
      await refreshData();
      showToast('🌱 Adubação registrada!');
    };
    document.getElementById('btn-add-photo').onclick = () => openPhotoModal(tree);

    const btnUnlockCmp = document.getElementById('btn-unlock-compare');
    if (btnUnlockCmp) {
      btnUnlockCmp.onclick = () => openPaywall('O comparador deslizante Antes vs. Depois é exclusivo da Licença Vitalícia PRO.');
    }

    const btnRemoveWire = document.getElementById('btn-remove-wire');
    if (btnRemoveWire) {
      btnRemoveWire.onclick = async () => {
        await DB.addLog({
          treeId: tree.id,
          type: 'desaramacao',
          date: todayStr(),
          title: 'Retirada de arames',
          notes: 'Arames removidos com alicate específico.'
        });
        await refreshData();
        showToast('Aramação encerrada com sucesso!');
      };
    }

    if (treePhotos.length >= 2 && proUnlocked) {
      const slider = document.getElementById('cmp-slider');
      const stageEl = document.getElementById('compare-stage');
      const beforeImg = document.getElementById('cmp-img-before');
      const afterImg = document.getElementById('cmp-img-after');
      const divider = document.getElementById('cmp-divider');
      const knob = document.getElementById('cmp-knob');
      const selBefore = document.getElementById('cmp-select-before');
      const selAfter = document.getElementById('cmp-select-after');
      const tagBefore = document.getElementById('cmp-tag-before');
      const tagAfter = document.getElementById('cmp-tag-after');

      const updatePos = (pct) => {
        const clamped = Math.max(2, Math.min(98, Number(pct)));
        beforeImg.style.clipPath = 'inset(0 ' + (100 - clamped) + '% 0 0)';
        divider.style.left = clamped + '%';
        knob.style.left = clamped + '%';
        slider.value = clamped;
      };

      slider.oninput = (e) => updatePos(e.target.value);

      const pointerMove = (clientX) => {
        const rect = stageEl.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        updatePos(pct);
      };

      stageEl.addEventListener('pointerdown', (ev) => {
        pointerMove(ev.clientX);
        const onMove = (mv) => pointerMove(mv.clientX);
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });

      selBefore.onchange = () => {
        const p = treePhotos[Number(selBefore.value)];
        if (p) {
          beforeImg.src = p.dataUrl;
          tagBefore.textContent = formatDateBR(p.date);
        }
      };
      selAfter.onchange = () => {
        const p = treePhotos[Number(selAfter.value)];
        if (p) {
          afterImg.src = p.dataUrl;
          tagAfter.textContent = formatDateBR(p.date);
        }
      };
    }

    container.querySelectorAll('[data-make-cover]').forEach((btn) => {
      btn.onclick = async () => {
        const p = treePhotos.find((x) => x.id === btn.getAttribute('data-make-cover'));
        if (p) {
          tree.coverPhoto = p.dataUrl;
          await DB.saveTree(tree);
          await refreshData();
          showToast('Foto definida como capa!');
        }
      };
    });

    container.querySelectorAll('[data-del-photo]').forEach((btn) => {
      btn.onclick = async () => {
        if (confirm('Excluir esta foto da galeria?')) {
          await DB.deletePhoto(btn.getAttribute('data-del-photo'));
          await refreshData();
          showToast('Foto excluída.');
        }
      };
    });

    container.querySelectorAll('[data-del-log]').forEach((btn) => {
      btn.onclick = async () => {
        if (confirm('Apagar este registro do diário?')) {
          await DB.deleteLog(btn.getAttribute('data-del-log'));
          await refreshData();
          showToast('Registro removido.');
        }
      };
    });
  }

  // ABA 2: MANEJO, ALERTAS & ASTROBOTÂNICA
  function renderCareTab() {
    const alertsContainer = document.getElementById('care-alerts-list');
    const seasonTasksEl = document.getElementById('season-tasks-box');
    if (!alertsContainer || !seasonTasksEl) return;

    const allAlerts = [];
    state.trees.forEach((t) => {
      computeTreeAlerts(t).forEach((a) => allAlerts.push(a));
    });

    const btnWaterAll = document.getElementById('btn-water-all');
    if (btnWaterAll) {
      btnWaterAll.style.display = state.trees.length > 0 ? 'inline-flex' : 'none';
      btnWaterAll.onclick = async () => {
        for (const t of state.trees) {
          await DB.addLog({
            treeId: t.id,
            type: 'rega',
            date: todayStr(),
            title: 'Rega geral da bancada',
            notes: ''
          });
        }
        await refreshData();
        showToast('💧 Todas as árvores marcadas como regadas hoje!');
      };
    }

    if (allAlerts.length === 0) {
      alertsContainer.innerHTML =
        '<div class="guide-card" style="text-align:center;">' +
          '<p style="font-size:0.9rem;color:var(--accent-leaf);font-weight:600;margin:4px 0;">✅ Tudo em dia na sua bancada!</p>' +
          '<p>Nenhum alerta crítico de rega, aramação ou adubação pendente hoje.</p>' +
        '</div>';
    } else {
      alertsContainer.innerHTML = allAlerts.map((a) =>
        '<div class="alert-card ' + esc(a.severity) + '">' +
          '<div class="alert-info">' +
            '<h4>' + esc(a.treeName) + ' — ' + esc(a.title) + '</h4>' +
            '<p>' + esc(a.subtitle) + '</p>' +
          '</div>' +
          '<button class="btn btn-secondary btn-sm" data-alert-go="' + esc(a.treeId) + '">Ver</button>' +
        '</div>'
      ).join('');

      alertsContainer.querySelectorAll('[data-alert-go]').forEach((b) => {
        b.onclick = () => openTreeDetail(b.getAttribute('data-alert-go'));
      });
    }

    const season = Botany.getCurrentSeasonInfo();
    const focusChips = (season.focus || []).map((f) => '<span class="chip">🌿 ' + esc(f) + '</span>').join('');
    seasonTasksEl.innerHTML =
      '<div class="guide-card">' +
        '<h4>' + esc(season.moonPhase) + ' • Dinâmica da Seiva Hoje</h4>' +
        '<p>' + esc(season.moonSap) + '</p>' +
      '</div>' +
      '<div class="guide-card">' +
        '<h4>' + esc(season.badge) + ' • ' + esc(season.name) + '</h4>' +
        '<div class="chips-row" style="margin:8px 0;">' + focusChips + '</div>' +
        '<ul class="step-list">' +
          season.tasks.map((tk) => '<li>' + esc(tk) + '</li>').join('') +
        '</ul>' +
      '</div>';
  }

  // ABA 3: ENCICLOPÉDIA FITOTÉCNICA (40 ESPÉCIES)
  function renderGuideTab() {
    const el = document.getElementById('species-catalog-list');
    if (!el) return;

    const proUnlocked = License.hasProAccess();
    const q = state.guideSearch.trim().toLowerCase();
    let list = Botany.SPECIES_DB.filter((s) => {
      if (s.id === 'outra') return false;
      if (state.guideScope === 'personal' && !s.personalCollection) return false;
      if (!q) return true;
      return (s.commonName + ' ' + s.scientificName + ' ' + (s.family || '') + ' ' + s.group).toLowerCase().includes(q);
    });

    let lockedNoticeHtml = '';
    if (!proUnlocked) {
      const maxFree = License.COMMERCIAL_CONFIG.freeLimits.freeSpeciesPreviewCount;
      if (list.length > maxFree) {
        lockedNoticeHtml =
          '<div class="pro-license-card">' +
            '<h4>👑 Desbloqueie as 40 Fichas Fitotécnicas</h4>' +
            '<p>O Plano Gratuito exibe ' + maxFree + ' espécies iniciais. Adquira a Licença Vitalícia PRO para acessar todas as 40 espécies completas.</p>' +
            '<a href="./licenca.html#adquirir" class="btn btn-gold btn-sm" style="text-decoration:none;">Ver Licença Vitalícia</a>' +
          '</div>';
        list = list.slice(0, maxFree);
      }
    }

    if (list.length === 0) {
      el.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.84rem;padding:16px 0;">Nenhuma espécie encontrada.</p>';
      return;
    }

    el.innerHTML = list.map((s) =>
      '<div class="guide-card">' +
        '<h4>' +
          esc(s.commonName) +
          ' <span style="font-weight:400;font-style:italic;color:var(--text-secondary);font-size:0.79rem;">(' + esc(s.scientificName) + ')</span>' +
        '</h4>' +
        '<div class="chips-row" style="margin:6px 0 8px;">' +
          '<span class="chip">🏺 ' + esc(s.repotSeason || (s.repotYears + ' anos')) + '</span>' +
          '<span class="chip">🌀 Arame: ~' + s.wireCheckDays + 'd</span>' +
          '<span class="chip">🌱 Adubo: ' + s.fertilizerIntervalDays + 'd</span>' +
        '</div>' +
        '<p><strong>☀️ Sol:</strong> ' + esc(s.sun) + '</p>' +
        '<p><strong>🏺 Substrato:</strong> ' + esc(s.substrate) + '</p>' +
        '<p><strong>✂️ Poda:</strong> ' + esc(s.pruningGuide || s.careTip) + '</p>' +
        '<p><strong>🌀 Aramação:</strong> ' + esc(s.wiringGuide || '') + '</p>' +
        '<p><strong>🌱 Adubação:</strong> ' + esc(s.fertGuide || '') + '</p>' +
        (s.sensitivities ? '<p><strong>🛡️ Atenção:</strong> ' + esc(s.sensitivities) + '</p>' : '') +
      '</div>'
    ).join('') + lockedNoticeHtml;
  }

  // ABA 4: PAINEL COMERCIAL LICENÇA VITALÍCIA + BACKUP
  function renderSettingsTab() {
    const statusCard = document.getElementById('license-status-card');
    const actBox = document.getElementById('license-activation-box');
    const summary = License.getStatusSummary();
    const cfg = License.COMMERCIAL_CONFIG;

    if (statusCard) {
      if (summary.tier === 'PRO_LIFETIME') {
        statusCard.innerHTML =
          '<h4>👑 ' + esc(summary.headline) + '</h4>' +
          '<p>' + esc(summary.description) + '</p>' +
          '<p style="font-family:monospace;font-size:0.78rem;color:#93ebb0;margin-bottom:10px;">Chave: ' + esc(summary.key) + '</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<a href="' + esc(cfg.salesPageUrl) + '" class="btn btn-secondary btn-sm" style="text-decoration:none;">Ver Página Oficial</a>' +
            '<button type="button" class="btn btn-danger btn-sm" id="btn-remove-license">Remover Chave Deste Aparelho</button>' +
          '</div>';
        if (actBox) actBox.style.display = 'none';
        const rmBtn = document.getElementById('btn-remove-license');
        if (rmBtn) {
          rmBtn.onclick = () => {
            if (confirm('Deseja desvincular a chave vitalícia deste navegador?')) {
              License.deactivateLicense();
              renderAll();
              showToast('Licença removida deste aparelho.');
            }
          };
        }
      } else {
        statusCard.innerHTML =
          '<h4>' + esc(summary.headline) + '</h4>' +
          '<p>' + esc(summary.description) + '</p>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.28);padding:10px 12px;border-radius:10px;margin:10px 0;">' +
            '<div>' +
              '<div style="font-size:0.73rem;color:var(--text-muted);text-decoration:line-through;">' + esc(cfg.priceOriginal) + '</div>' +
              '<div style="font-size:1.15rem;font-weight:800;color:#f6d58e;">' + esc(cfg.priceCurrent) + ' <span style="font-size:0.74rem;font-weight:500;color:var(--text-secondary);">• Vitalício</span></div>' +
            '</div>' +
            '<a href="' + esc(cfg.salesPageUrl) + '" class="btn btn-gold btn-sm" style="text-decoration:none;">Página da Licença →</a>' +
          '</div>';
        if (actBox) actBox.style.display = 'block';
      }
    }

    const urlBox = document.getElementById('current-pwa-url');
    if (urlBox) {
      urlBox.textContent = 'https://deomagalhaes.com.br/bonsai/';
    }
    const qrImg = document.getElementById('qr-install-img');
    if (qrImg) {
      const targetUrl = 'https://deomagalhaes.com.br/bonsai/';
      qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(targetUrl);
    }
  }

  function renderAll() {
    renderHeaderLicenseBadge();
    renderTreesTab();
    if (state.activeTab === 'detail') renderTreeDetail();
    renderCareTab();
    renderGuideTab();
    renderSettingsTab();
  }

  function openTreeModal(existingTree) {
    if (!existingTree && !License.canAddMoreTrees(state.trees.length)) {
      openPaywall('O Plano Gratuito permite até ' + License.COMMERCIAL_CONFIG.freeLimits.maxTrees + ' árvores. Ative sua Licença Vitalícia PRO para cadastrar árvores ilimitadas!');
      return;
    }

    state.editingTreeId = existingTree ? existingTree.id : null;
    const modal = document.getElementById('modal-tree');
    document.getElementById('modal-tree-title').textContent = existingTree ? 'Editar Bonsai' : 'Novo Bonsai';

    const personalOpts = Botany.SPECIES_DB.filter((s) => s.personalCollection).map((s) =>
      '<option value="' + s.id + '">' + esc(s.commonName) + ' (' + esc(s.scientificName) + ')</option>'
    ).join('');

    const classicOpts = Botany.SPECIES_DB.filter((s) => !s.personalCollection && s.id !== 'outra').map((s) =>
      '<option value="' + s.id + '">' + esc(s.commonName) + ' (' + esc(s.scientificName) + ')</option>'
    ).join('');

    const spSelect = document.getElementById('f-species');
    spSelect.innerHTML =
      '<optgroup label="⭐ Tropicais, Nativas &amp; Frutíferas (23)">' + personalOpts + '</optgroup>' +
      '<optgroup label="📚 Clássicas Consagradas (17)">' + classicOpts + '</optgroup>' +
      '<optgroup label="Personalizada"><option value="outra">Outra Espécie (Digitar manualmente)</option></optgroup>';

    const styleSelect = document.getElementById('f-style');
    styleSelect.innerHTML = Botany.STYLES.map((st) =>
      '<option value="' + st.id + '">' + esc(st.name) + '</option>'
    ).join('');

    if (existingTree) {
      document.getElementById('f-name').value = existingTree.name || '';
      spSelect.value = existingTree.speciesId || 'jabuticabeira';
      document.getElementById('f-custom-species').value = existingTree.customSpecies || '';
      document.getElementById('f-scientific').value = existingTree.scientificName || '';
      styleSelect.value = existingTree.styleId || 'moyogi';
      document.getElementById('f-bench').value = existingTree.bench || '';
      document.getElementById('f-age').value = existingTree.estimatedAgeYears || '';
      document.getElementById('f-acquired').value = existingTree.acquiredDate || '';
      document.getElementById('f-height').value = existingTree.heightCm || '';
      document.getElementById('f-nebari').value = existingTree.nebariCm || '';
      document.getElementById('f-pot').value = existingTree.potType || '';
      document.getElementById('f-substrate').value = existingTree.substrate || '';
      document.getElementById('f-water-days').value = existingTree.waterIntervalDays || 1;
      document.getElementById('f-fert-days').value = existingTree.fertilizerIntervalDays || 30;
      document.getElementById('f-notes').value = existingTree.notes || '';
    } else {
      document.getElementById('form-tree').reset();
      spSelect.value = 'jabuticabeira';
      const defSp = Botany.getSpeciesById('jabuticabeira');
      document.getElementById('f-scientific').value = defSp.scientificName;
      document.getElementById('f-substrate').value = defSp.substrate;
      document.getElementById('f-water-days').value = defSp.waterDaysSummer;
      document.getElementById('f-fert-days').value = defSp.fertilizerIntervalDays;
    }

    modal._treeCoverDataUrl = null;
    const treePrevWrap = document.getElementById('f-cover-preview-wrap');
    const treePrevImg = document.getElementById('f-cover-preview');
    if (existingTree && existingTree.coverPhoto) {
      treePrevImg.src = existingTree.coverPhoto;
      treePrevWrap.style.display = 'block';
    } else {
      treePrevWrap.style.display = 'none';
    }

    const toggleCustomSpecies = () => {
      const val = spSelect.value;
      document.getElementById('wrap-custom-species').style.display = val === 'outra' ? 'block' : 'none';
      if (!existingTree && val !== 'outra') {
        const sp = Botany.getSpeciesById(val);
        document.getElementById('f-scientific').value = sp.scientificName;
        document.getElementById('f-substrate').value = sp.substrate;
        document.getElementById('f-water-days').value = sp.waterDaysSummer;
        document.getElementById('f-fert-days').value = sp.fertilizerIntervalDays;
      }
    };
    spSelect.onchange = toggleCustomSpecies;
    toggleCustomSpecies();

    modal.classList.add('open');
  }

  function openInterventionModal(tree) {
    const modal = document.getElementById('modal-intervention');
    document.getElementById('form-intervention').reset();
    document.getElementById('int-tree-id').value = tree.id;
    document.getElementById('int-date').value = todayStr();

    const typeSel = document.getElementById('int-type');
    typeSel.innerHTML = Botany.INTERVENTION_TYPES.map((t) =>
      '<option value="' + t.id + '">' + t.icon + ' ' + esc(t.label) + '</option>'
    ).join('');

    const sp = Botany.getSpeciesById(tree.speciesId);
    document.getElementById('int-wire-days').value = sp.wireCheckDays || 45;

    const syncFields = () => {
      const val = typeSel.value;
      document.getElementById('wrap-wire-fields').style.display = val === 'aramacao' ? 'block' : 'none';
      document.getElementById('wrap-product-field').style.display =
        (val === 'adubacao' || val === 'fitossanitario') ? 'block' : 'none';
    };
    typeSel.onchange = syncFields;
    syncFields();

    modal.classList.add('open');
  }

  function openPhotoModal(tree) {
    const modal = document.getElementById('modal-photo');
    document.getElementById('form-photo').reset();
    document.getElementById('ph-tree-id').value = tree.id;
    document.getElementById('ph-date').value = todayStr();
    document.getElementById('ph-preview-wrap').style.display = 'none';
    modal._compressedDataUrl = null;
    modal.classList.add('open');
  }

  // Motor Híbrido de Câmera Instantânea (Câmera Nativa no Celular + Visor WebRTC no Desktop)
  let activeLiveStream = null;
  let liveCamCallback = null;

  function stopLiveCamera() {
    if (activeLiveStream) {
      activeLiveStream.getTracks().forEach((tr) => tr.stop());
      activeLiveStream = null;
    }
    const vid = document.getElementById('live-cam-video');
    if (vid) vid.srcObject = null;
    const mod = document.getElementById('modal-live-cam');
    if (mod) mod.classList.remove('open');
  }

  async function launchCameraCapture(nativeCameraInput, onCapturedDataUrl) {
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    if (isMobileDevice) {
      nativeCameraInput.value = '';
      nativeCameraInput.click();
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false
        });
        activeLiveStream = stream;
        liveCamCallback = onCapturedDataUrl;
        const vid = document.getElementById('live-cam-video');
        vid.srcObject = stream;
        document.getElementById('modal-live-cam').classList.add('open');
        return;
      } catch (_) {
        // Sem webcam ou permissão negada: usa seletor nativo como fallback
      }
    }

    nativeCameraInput.value = '';
    nativeCameraInput.click();
  }

  function bindGlobalEvents() {
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.onclick = () => switchTab(btn.getAttribute('data-tab'));
    });

    document.getElementById('btn-top-add').onclick = () => openTreeModal(null);
    const btnProStatus = document.getElementById('btn-pro-status'); if (btnProStatus) { btnProStatus.onclick = () => switchTab('settings'); }

    const btnPaywallHaveKey = document.getElementById('btn-paywall-have-key');
    if (btnPaywallHaveKey) {
      btnPaywallHaveKey.onclick = () => {
        document.getElementById('modal-paywall').classList.remove('open');
        switchTab('settings');
      };
    }

    const formActivate = document.getElementById('form-activate-license');
    if (formActivate) {
      formActivate.onsubmit = (ev) => {
        ev.preventDefault();
        const email = document.getElementById('lic-input-email').value;
        const key = document.getElementById('lic-input-key').value;
        const res = License.activateLicense(email, key);
        if (res.valid) {
          formActivate.reset();
          renderAll();
          showToast('👑 Licença Vitalícia PRO ativada com sucesso!');
        } else {
          alert(res.reason);
        }
      };
    }

    const searchInput = document.getElementById('trees-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        state.treeSearch = e.target.value;
        renderTreesTab();
      };
    }

    const guideSearchInput = document.getElementById('guide-search-input');
    if (guideSearchInput) {
      guideSearchInput.oninput = (e) => {
        state.guideSearch = e.target.value;
        renderGuideTab();
      };
    }

    document.querySelectorAll('[data-guide-scope]').forEach((btn) => {
      btn.onclick = () => {
        state.guideScope = btn.getAttribute('data-guide-scope');
        document.querySelectorAll('[data-guide-scope]').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        renderGuideTab();
      };
    });

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.onclick = () => {
        btn.closest('.modal-backdrop').classList.remove('open');
      };
    });

    document.getElementById('form-tree').onsubmit = async (ev) => {
      ev.preventDefault();
      const existing = state.editingTreeId
        ? state.trees.find((x) => x.id === state.editingTreeId)
        : null;

      const spId = document.getElementById('f-species').value;
      const spObj = Botany.getSpeciesById(spId);

      const payload = Object.assign({}, existing || {}, {
        name: document.getElementById('f-name').value.trim() || 'Meu Bonsai',
        speciesId: spId,
        customSpecies: document.getElementById('f-custom-species').value.trim(),
        scientificName: document.getElementById('f-scientific').value.trim(),
        styleId: document.getElementById('f-style').value,
        bench: document.getElementById('f-bench').value.trim(),
        estimatedAgeYears: document.getElementById('f-age').value ? Number(document.getElementById('f-age').value) : null,
        acquiredDate: document.getElementById('f-acquired').value || '',
        heightCm: document.getElementById('f-height').value ? Number(document.getElementById('f-height').value) : null,
        nebariCm: document.getElementById('f-nebari').value ? Number(document.getElementById('f-nebari').value) : null,
        potType: document.getElementById('f-pot').value.trim(),
        substrate: document.getElementById('f-substrate').value.trim(),
        waterIntervalDays: Number(document.getElementById('f-water-days').value) || 1,
        fertilizerIntervalDays: Number(document.getElementById('f-fert-days').value) || 30,
        repotIntervalYears: spObj.repotYears || 2,
        notes: document.getElementById('f-notes').value.trim()
      });

      const treeModal = document.getElementById('modal-tree');
      if (treeModal._treeCoverDataUrl) {
        payload.coverPhoto = treeModal._treeCoverDataUrl;
      }

      const saved = await DB.saveTree(payload);

      if (treeModal._treeCoverDataUrl) {
        await DB.addPhoto({
          treeId: saved.id,
          date: todayStr(),
          angle: 'Frente',
          caption: existing ? 'Atualização de capa' : 'Registro inicial',
          dataUrl: treeModal._treeCoverDataUrl
        });
      }

      treeModal.classList.remove('open');
      await refreshData();
      openTreeDetail(saved.id);
      showToast('Bonsai salvo com sucesso!');
    };

    document.getElementById('form-intervention').onsubmit = async (ev) => {
      ev.preventDefault();
      const treeId = document.getElementById('int-tree-id').value;
      const type = document.getElementById('int-type').value;
      const meta = Botany.getInterventionMeta(type);
      const title = document.getElementById('int-title').value.trim() || meta.label;

      await DB.addLog({
        treeId,
        type,
        date: document.getElementById('int-date').value || todayStr(),
        title,
        product: document.getElementById('int-product').value.trim(),
        wireCheckDays: document.getElementById('int-wire-days').value,
        wireGauge: document.getElementById('int-wire-gauge').value.trim(),
        notes: document.getElementById('int-notes').value.trim()
      });

      document.getElementById('modal-intervention').classList.remove('open');
      await refreshData();
      showToast(meta.icon + ' Intervenção salva!');
    };

    // Captura de foto no Modal de Árvore (Câmera na Hora ou Galeria)
    const treeModalEl = document.getElementById('modal-tree');
    const treeCamInput = document.getElementById('f-cover-camera');
    const treeGalInput = document.getElementById('f-cover-file');
    const applyTreeCoverPreview = (dataUrl) => {
      treeModalEl._treeCoverDataUrl = dataUrl;
      document.getElementById('f-cover-preview').src = dataUrl;
      document.getElementById('f-cover-preview-wrap').style.display = 'block';
    };

    document.getElementById('btn-tree-camera').onclick = () => {
      launchCameraCapture(treeCamInput, applyTreeCoverPreview);
    };
    document.getElementById('btn-tree-gallery').onclick = () => {
      treeGalInput.value = '';
      treeGalInput.click();
    };
    treeCamInput.onchange = async () => {
      if (treeCamInput.files && treeCamInput.files[0]) {
        applyTreeCoverPreview(await DB.compressImageFile(treeCamInput.files[0]));
      }
    };
    treeGalInput.onchange = async () => {
      if (treeGalInput.files && treeGalInput.files[0]) {
        applyTreeCoverPreview(await DB.compressImageFile(treeGalInput.files[0]));
      }
    };

    // Captura de foto no Modal de Registro Fotográfico (Câmera na Hora ou Galeria)
    const photoModalEl = document.getElementById('modal-photo');
    const phCamInput = document.getElementById('ph-camera');
    const phGalInput = document.getElementById('ph-file');
    const applyPhotoRecordPreview = (dataUrl, badgeLabel) => {
      photoModalEl._compressedDataUrl = dataUrl;
      document.getElementById('ph-preview').src = dataUrl;
      document.getElementById('ph-source-badge').textContent = badgeLabel || '✓ Foto pronta';
      document.getElementById('ph-preview-wrap').style.display = 'block';
    };

    document.getElementById('btn-ph-camera').onclick = () => {
      launchCameraCapture(phCamInput, (url) => applyPhotoRecordPreview(url, '📸 Capturada na hora'));
    };
    document.getElementById('btn-ph-gallery').onclick = () => {
      phGalInput.value = '';
      phGalInput.click();
    };
    phCamInput.onchange = async () => {
      if (phCamInput.files && phCamInput.files[0]) {
        const dataUrl = await DB.compressImageFile(phCamInput.files[0]);
        applyPhotoRecordPreview(dataUrl, '📸 Capturada na hora');
      }
    };
    phGalInput.onchange = async () => {
      if (phGalInput.files && phGalInput.files[0]) {
        const dataUrl = await DB.compressImageFile(phGalInput.files[0]);
        applyPhotoRecordPreview(dataUrl, '🖼️ Selecionada da galeria');
      }
    };

    // Controles do Modal de Câmera ao Vivo (Desktop / WebRTC)
    document.getElementById('btn-close-live-cam').onclick = stopLiveCamera;
    document.getElementById('btn-cancel-live-cam').onclick = stopLiveCamera;
    document.getElementById('btn-snap-live-cam').onclick = () => {
      const vid = document.getElementById('live-cam-video');
      if (!vid || !vid.videoWidth) return;
      const maxSide = 920;
      let w = vid.videoWidth;
      let h = vid.videoHeight;
      if (w > maxSide || h > maxSide) {
        if (w >= h) {
          h = Math.round((h * maxSide) / w);
          w = maxSide;
        } else {
          w = Math.round((w * maxSide) / h);
          h = maxSide;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(vid, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      const cb = liveCamCallback;
      stopLiveCamera();
      if (cb) cb(dataUrl);
    };

    document.getElementById('form-photo').onsubmit = async (ev) => {
      ev.preventDefault();
      const modal = document.getElementById('modal-photo');
      if (!modal._compressedDataUrl) {
        alert('Selecione ou tire uma foto primeiro.');
        return;
      }
      await DB.addPhoto({
        treeId: document.getElementById('ph-tree-id').value,
        date: document.getElementById('ph-date').value || todayStr(),
        angle: document.getElementById('ph-angle').value,
        caption: document.getElementById('ph-caption').value.trim(),
        dataUrl: modal._compressedDataUrl,
        setAsCover: document.getElementById('ph-set-cover').checked
      });
      modal.classList.remove('open');
      await refreshData();
      showToast('📷 Foto adicionada à evolução!');
    };

    document.getElementById('btn-export-backup').onclick = async () => {
      if (!License.hasProAccess()) {
        openPaywall('A exportação completa de backup em JSON (com fotos) faz parte da Licença Vitalícia PRO.');
        return;
      }
      const data = await DB.exportFullBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bonsai-hub-backup-' + todayStr() + '.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup completo exportado!');
    };

    const importInput = document.getElementById('input-import-backup');
    document.getElementById('btn-import-backup').onclick = () => {
      if (!License.hasProAccess()) {
        openPaywall('A restauração completa de backup faz parte da Licença Vitalícia PRO.');
        return;
      }
      importInput.click();
    };
    importInput.onchange = (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const counts = await DB.importFullBackup(parsed);
          await refreshData();
          showToast('Restaurado: ' + counts.trees + ' árvore(s) e ' + counts.photos + ' foto(s)!');
        } catch (err) {
          alert('Erro ao restaurar backup: ' + err.message);
        }
      };
      reader.readAsText(file);
    };

    const btnLoadDemo3 = document.getElementById('btn-load-demo3');
    if (btnLoadDemo3) {
      btnLoadDemo3.onclick = async () => {
        await DB.seedCommercialDemoPack();
        await refreshData();
        switchTab('trees');
        showToast('✨ 3 bonsais de demonstração adicionados!');
      };
    }

    const btnSyncAcervo = document.getElementById('btn-sync-acervo');
    if (btnSyncAcervo) {
      btnSyncAcervo.onclick = async () => {
        const added = await DB.syncPersonalCollection();
        await refreshData();
        switchTab('trees');
        showToast(added > 0 ? added + ' espécie(s) adicionada(s) à bancada!' : 'As 23 espécies já estão na bancada!');
      };
    }

    const btnClearBench = document.getElementById('btn-clear-bench');
    if (btnClearBench) {
      btnClearBench.onclick = async () => {
        if (confirm('Tem certeza que deseja limpar todas as árvores e fotos salvas neste aparelho?')) {
          await DB.clearAllBenchData();
          await refreshData();
          switchTab('trees');
          showToast('Bancada limpa com sucesso.');
        }
      };
    }

    const btnInstallPwa = document.getElementById('btn-install-pwa');
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      if (btnInstallPwa) btnInstallPwa.style.display = 'inline-flex';
    });

    if (btnInstallPwa) {
      btnInstallPwa.onclick = async () => {
        if (state.deferredInstallPrompt) {
          state.deferredInstallPrompt.prompt();
          await state.deferredInstallPrompt.userChoice;
          state.deferredInstallPrompt = null;
          btnInstallPwa.style.display = 'none';
        } else {
          switchTab('settings');
        }
      };
    }
  }

  async function init() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }

    bindGlobalEvents();
    await refreshData();

    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new-tree') {
      openTreeModal(null);
    } else if (params.get('tab') === 'care') {
      switchTab('care');
    } else if (params.get('tab') === 'pro') {
      switchTab('settings');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
