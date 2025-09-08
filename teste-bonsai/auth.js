// ===================================================================
// CONFIGURAÇÃO DO SUPABASE
// ===================================================================
// IMPORTANTE: Substitua com os seus próprios dados do Supabase!
const SUPABASE_URL = 'https://wtrusyinemekhlvceiqs.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q-rhMUzt8jmR_dEX0e8uCA_wVhr7hwL';

// Inicializa o cliente Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ===================================================================
// ELEMENTOS DA PÁGINA (DOM)
// ===================================================================
const authSection = document.getElementById('auth-section');
const contentSection = document.getElementById('content-section');
const loginButton = document.getElementById('login-button');


// ===================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ===================================================================

// Função para fazer login com o Google
async function signInWithGoogle() {
    const { data, error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.href 
        }
    });
    // ...
}

// Função para fazer logout
async function signOut() {
    const { error } = await _supabase.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// ===================================================================
// GESTÃO DA INTERFACE (UI)
// ===================================================================

// Atualiza a interface com base no estado de login do utilizador
function updateUserInterface(user) {
    if (user) {
        // Se o utilizador está logado:
        // 1. Mostra o conteúdo protegido
        contentSection.style.display = 'block';

        // 2. Atualiza a secção de autenticação com boas-vindas e botão de logout
        authSection.innerHTML = `
            <p>Bem-vindo, ${user.user_metadata.full_name || user.email}!</p>
            <button id="logout-button" class="btn">Sair</button>
        `;

        // 3. Adiciona o evento ao novo botão de logout
        document.getElementById('logout-button').addEventListener('click', signOut);

    } else {
        // Se o utilizador NÃO está logado:
        // 1. Esconde o conteúdo protegido
        contentSection.style.display = 'none';

        // 2. Mostra a mensagem e o botão de login originais
        authSection.innerHTML = `
            <p>Para ver o conteúdo, por favor, faça login.</p>
            <button id="login-button" class="btn">Entrar com o Google</button>
        `;

        // 3. Adiciona o evento ao novo botão de login
        document.getElementById('login-button').addEventListener('click', signInWithGoogle);
    }
}