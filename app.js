const firebaseConfig = {
  apiKey: "AIzaSyBJloGEReetkAN9SyWLsKtmGBY--15BVrE",
  authDomain: "retifica-monteiro.firebaseapp.com",
  projectId: "retifica-monteiro",
  storageBucket: "retifica-monteiro.firebasestorage.app",
  messagingSenderId: "379556838037",
  appId: "1:379556838037:web:ea4008acaa2f83205d399c",
  measurementId: "G-9Y6QDKCMG6"
};

// ╔═══════════════════════════════════════════════════════════════╗
// ║  COLOQUE AQUI O SEU E-MAIL (o primeiro administrador)         ║
// ║  Este e-mail terá acesso mesmo sem estar no banco ainda.      ║
// ╚═══════════════════════════════════════════════════════════════╝
const EMAIL_ADMIN_PRINCIPAL = "COLE_SEU_EMAIL_AQUI";

// ── Inicializa Firebase ──
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const colecao = db.collection("ordens");
const colecaoUsuarios = db.collection("usuarios_permitidos");

// ══════════════════════════════════════════
// AUTENTICAÇÃO
// ══════════════════════════════════════════
let modoCriarConta = false;
let usuarioAtual = null;

function alternarModoLogin() {
  modoCriarConta = !modoCriarConta;
  document.getElementById("btnLogin").textContent = modoCriarConta ? "Criar conta" : "Entrar com e-mail";
  document.getElementById("loginToggle").innerHTML = modoCriarConta
    ? 'Já tem conta? <a onclick="alternarModoLogin()">Fazer login</a>'
    : 'Primeiro acesso? <a onclick="alternarModoLogin()">Criar conta com e-mail</a>';
  document.getElementById("loginErro").textContent = "";
}

// ── Verificar se e-mail é autorizado ──
async function emailAutorizado(email) {
  const emailLower = email.toLowerCase();

  // Admin principal sempre tem acesso
  if (emailLower === EMAIL_ADMIN_PRINCIPAL.toLowerCase()) return true;

  try {
    const doc = await colecaoUsuarios.doc(emailLower).get();
    return doc.exists;
  } catch (e) {
    console.error("Erro ao verificar autorização:", e);
    return false;
  }
}

// ── Garantir que admin principal está no banco ──
async function garantirAdminNoBanco() {
  const emailLower = EMAIL_ADMIN_PRINCIPAL.toLowerCase();
  try {
    const doc = await colecaoUsuarios.doc(emailLower).get();
    if (!doc.exists) {
      await colecaoUsuarios.doc(emailLower).set({
        email: emailLower,
        admin: true,
        criadoEm: agora()
      });
    }
  } catch (e) {
    console.warn("Não foi possível registrar admin:", e);
  }
}

// ── Login com Google ──
async function loginComGoogle() {
  const erroEl = document.getElementById("loginErro");
  erroEl.textContent = "";

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    // O onAuthStateChanged vai cuidar do resto
  } catch (e) {
    if (e.code === "auth/popup-closed-by-user") return;
    if (e.code === "auth/cancelled-popup-request") return;
    erroEl.textContent = "Erro ao entrar com Google: " + e.message;
  }
}

// ── Login com e-mail/senha ──
async function loginComEmail() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;
  const erroEl = document.getElementById("loginErro");
  erroEl.textContent = "";

  if (!email || !senha) {
    erroEl.textContent = "Preencha e-mail e senha.";
    return;
  }
  if (senha.length < 6) {
    erroEl.textContent = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  document.getElementById("btnLogin").disabled = true;
  document.getElementById("btnLogin").innerHTML =
    '<span class="spinner"></span>' + (modoCriarConta ? "Criando..." : "Entrando...");

  try {
    if (modoCriarConta) {
      await auth.createUserWithEmailAndPassword(email, senha);
    } else {
      await auth.signInWithEmailAndPassword(email, senha);
    }
  } catch (e) {
    const msgs = {
      "auth/email-already-in-use": "Este e-mail já está cadastrado. Faça login.",
      "auth/invalid-email": "E-mail inválido.",
      "auth/user-not-found": "Usuário não encontrado. Crie uma conta.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.",
      "auth/weak-password": "Senha muito fraca. Use pelo menos 6 caracteres.",
      "auth/network-request-failed": "Sem conexão com a internet.",
    };
    erroEl.textContent = msgs[e.code] || "Erro: " + e.message;
  } finally {
    document.getElementById("btnLogin").disabled = false;
    document.getElementById("btnLogin").textContent = modoCriarConta ? "Criar conta" : "Entrar com e-mail";
  }
}

function fazerLogout() {
  if (confirm("Deseja sair do sistema?")) auth.signOut();
}

function voltarParaLogin() {
  auth.signOut();
  document.getElementById("acessoNegado").classList.add("hidden");
  document.getElementById("loginOverlay").classList.remove("hidden");
}

// ── Observa estado de autenticação ──
auth.onAuthStateChanged(async function (user) {
  if (user) {
    // Verificar se é autorizado
    const autorizado = await emailAutorizado(user.email);

    if (!autorizado) {
      // Mostrar tela de acesso negado
      document.getElementById("loginOverlay").classList.add("hidden");
      document.getElementById("sistemaApp").classList.add("hidden");
      document.getElementById("acessoNegado").classList.remove("hidden");
      document.getElementById("emailNegado").textContent = user.email;
      return;
    }

    // Autorizado — garantir admin no banco e entrar
    await garantirAdminNoBanco();
    usuarioAtual = user;

    document.getElementById("loginOverlay").classList.add("hidden");
    document.getElementById("acessoNegado").classList.add("hidden");
    document.getElementById("sistemaApp").classList.remove("hidden");
    document.getElementById("userEmail").textContent = user.email;
    entrarModoNovo();
    carregarRegistros();
  } else {
    usuarioAtual = null;
    document.getElementById("loginOverlay").classList.remove("hidden");
    document.getElementById("sistemaApp").classList.add("hidden");
    document.getElementById("acessoNegado").classList.add("hidden");
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginSenha").value = "";
    document.getElementById("loginErro").textContent = "";
  }
});

// ══════════════════════════════════════════
// GERENCIAR USUÁRIOS AUTORIZADOS
// ══════════════════════════════════════════
function abrirGerenciarUsuarios() {
  document.getElementById("painelUsuarios").classList.remove("hidden");
  listarUsuarios();
}

function fecharGerenciarUsuarios() {
  document.getElementById("painelUsuarios").classList.add("hidden");
}

async function listarUsuarios() {
  const container = document.getElementById("listaUsuarios");
  container.innerHTML = '<div class="small">Carregando...</div>';

  try {
    const snap = await colecaoUsuarios.orderBy("email").get();
    if (snap.empty) {
      container.innerHTML = '<div class="small">Nenhum usuário cadastrado.</div>';
      return;
    }

    container.innerHTML = "";
    snap.forEach(function (doc) {
      const u = doc.data();
      const emailU = u.email || doc.id;
      const isAdmin = u.admin === true;
      const isSelf = usuarioAtual && emailU === usuarioAtual.email.toLowerCase();

      const row = document.createElement("div");
      row.className = "user-row";
      row.innerHTML =
        '<div>' +
          '<span class="email">' + escapeHtml(emailU) + '</span>' +
          (isAdmin ? '<span class="badge">Admin</span>' : '') +
        '</div>' +
        (isSelf
          ? '<span class="small">Você</span>'
          : '<button class="danger" onclick="removerUsuario(\'' + escapeHtml(emailU) + '\')">Remover</button>'
        );
      container.appendChild(row);
    });
  } catch (e) {
    container.innerHTML = '<div class="small" style="color:var(--danger)">Erro ao carregar usuários.</div>';
    console.error(e);
  }
}

async function adicionarUsuario() {
  const input = document.getElementById("novoEmail");
  const email = input.value.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    alert("Informe um e-mail válido.");
    return;
  }

  try {
    await colecaoUsuarios.doc(email).set({
      email: email,
      admin: false,
      criadoEm: agora()
    });
    input.value = "";
    alert("Usuário " + email + " adicionado com sucesso.");
    listarUsuarios();
  } catch (e) {
    alert("Erro ao adicionar: " + e.message);
  }
}

async function removerUsuario(email) {
  if (!confirm("Remover o acesso de " + email + "?")) return;

  try {
    await colecaoUsuarios.doc(email).delete();
    alert("Usuário removido.");
    listarUsuarios();
  } catch (e) {
    alert("Erro ao remover: " + e.message);
  }
}

// ══════════════════════════════════════════
// ESTADO GLOBAL
// ══════════════════════════════════════════
var dados = [];
var editandoId = null;
var carregando = false;

// ══════════════════════════════════════════
// UTILITÁRIOS
// ══════════════════════════════════════════
function classificarArquivo(mimeType) {
  if (!mimeType) return "outro";
  if (mimeType.startsWith("image/")) return "foto";
  if (mimeType === "application/pdf") return "pdf";
  return "outro";
}

function iconeArquivo(tipo, nome) {
  if (tipo === "foto") return "🖼️";
  if (tipo === "pdf") return "📄";
  var ext = (nome || "").split(".").pop().toLowerCase();
  if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
  if (["doc", "docx", "txt", "rtf"].includes(ext)) return "📝";
  if (["zip", "rar", "7z"].includes(ext)) return "📦";
  return "📎";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function agora() {
  return new Date().toLocaleString("pt-BR");
}

function formatarTamanho(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function obterArquivos(reg) {
  if (reg.arquivos) return reg.arquivos;
  if (reg.fotos)
    return reg.fotos.map(function (f) {
      return Object.assign({}, f, { tipo: f.tipo || "foto", url: f.url || f.src });
    });
  return [];
}

// ══════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════
function setStatus(online) {
  document.getElementById("statusDot").className =
    "status-dot " + (online ? "dot-online" : "dot-offline");
  document.getElementById("statusText").textContent = online
    ? "Conectado ao Firebase"
    : "Sem conexão";
}

function setLoading(on) {
  carregando = on;
  document.getElementById("formCard").classList.toggle("loading", on);
  document.getElementById("btnSalvar").innerHTML = on
    ? '<span class="spinner"></span>Salvando...'
    : editandoId
    ? "Salvar alterações"
    : "Salvar OS";
}

function mostrarProgresso(pct, texto) {
  document.getElementById("uploadProgress").classList.remove("hidden");
  document.getElementById("uploadBar").style.width = pct + "%";
  if (texto) {
    document.getElementById("uploadStatus").classList.remove("hidden");
    document.getElementById("uploadStatus").textContent = texto;
  }
}

function esconderProgresso() {
  document.getElementById("uploadProgress").classList.add("hidden");
  document.getElementById("uploadBar").style.width = "0%";
  document.getElementById("uploadStatus").classList.add("hidden");
}

// ══════════════════════════════════════════
// FIREBASE STORAGE
// ══════════════════════════════════════════
async function uploadArquivo(registroId, file, indice, total) {
  var nomeUnico = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  var ref = storage.ref("arquivos/" + registroId + "/" + nomeUnico);

  return new Promise(function (resolve, reject) {
    var task = ref.put(file);
    task.on(
      "state_changed",
      function (snap) {
        var pctArquivo = (snap.bytesTransferred / snap.totalBytes) * 100;
        var pctGeral = ((indice + pctArquivo / 100) / total) * 100;
        mostrarProgresso(pctGeral, "Enviando " + (indice + 1) + " de " + total + ": " + file.name);
      },
      function (err) { reject(err); },
      async function () {
        var url = await task.snapshot.ref.getDownloadURL();
        resolve({
          nome: file.name, url: url, path: ref.fullPath,
          tipo: classificarArquivo(file.type), mimeType: file.type, tamanho: file.size,
        });
      }
    );
  });
}

async function excluirArquivoStorage(filePath) {
  if (!filePath) return;
  try { await storage.ref(filePath).delete(); }
  catch (e) { console.warn("Arquivo não encontrado:", e); }
}

// ══════════════════════════════════════════
// FIRESTORE — CARREGAR REGISTROS
// ══════════════════════════════════════════
async function carregarRegistros() {
  try {
    var snap = await colecao.orderBy("criadoEm", "desc").get();
    dados = snap.docs.map(function (doc) {
      return Object.assign({ id: doc.id }, doc.data());
    });
    setStatus(true);
    filtrarLista();
  } catch (e) {
    console.error("Erro ao carregar:", e);
    setStatus(false);
  }
}

// ══════════════════════════════════════════
// FORMULÁRIO
// ══════════════════════════════════════════
function limparFormulario() {
  ["os", "cliente", "motor", "veiculo", "servico"].forEach(function (id) {
    document.getElementById(id).value = "";
  });
  document.getElementById("arquivos").value = "";
  esconderProgresso();
}

function entrarModoNovo() {
  editandoId = null;
  document.getElementById("formTitulo").textContent = "Nova Ordem de Serviço";
  document.getElementById("modoLabel").textContent = "Modo: Novo cadastro";
  document.getElementById("btnSalvar").textContent = "Salvar OS";
  document.getElementById("btnCancelar").classList.add("hidden");
  limparFormulario();
}

function entrarModoEdicao(reg) {
  editandoId = reg.id;
  document.getElementById("formTitulo").textContent = "Editar Ordem de Serviço";
  document.getElementById("modoLabel").textContent = "Modo: Edição da OS " + reg.os;
  document.getElementById("btnSalvar").textContent = "Salvar alterações";
  document.getElementById("btnCancelar").classList.remove("hidden");
  document.getElementById("os").value = reg.os || "";
  document.getElementById("cliente").value = reg.cliente || "";
  document.getElementById("motor").value = reg.motor || "";
  document.getElementById("veiculo").value = reg.veiculo || "";
  document.getElementById("servico").value = reg.servico || "";
  document.getElementById("arquivos").value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelarEdicao() { entrarModoNovo(); }

// ══════════════════════════════════════════
// SALVAR (CRIAR OU EDITAR)
// ══════════════════════════════════════════
async function salvarRegistro() {
  if (carregando) return;

  var os = document.getElementById("os").value.trim();
  var cliente = document.getElementById("cliente").value.trim();
  var motor = document.getElementById("motor").value.trim();
  var veiculo = document.getElementById("veiculo").value.trim();
  var servico = document.getElementById("servico").value.trim();
  var files = document.getElementById("arquivos").files;

  if (!os) { alert("Informe o número da OS."); return; }

  setLoading(true);

  try {
    var registroId = editandoId || colecao.doc().id;
    var novosArquivos = [];
    for (var i = 0; i < files.length; i++) {
      var arq = await uploadArquivo(registroId, files[i], i, files.length);
      novosArquivos.push(arq);
    }
    esconderProgresso();

    if (editandoId) {
      var regAtual = dados.find(function (r) { return r.id === editandoId; });
      var arquivosAtuais = obterArquivos(regAtual);
      await colecao.doc(editandoId).update({
        os: os, cliente: cliente, motor: motor, veiculo: veiculo, servico: servico,
        arquivos: arquivosAtuais.concat(novosArquivos),
        atualizadoEm: agora(),
      });
      alert("Registro atualizado com sucesso.");
    } else {
      await colecao.doc(registroId).set({
        os: os, cliente: cliente, motor: motor, veiculo: veiculo, servico: servico,
        arquivos: novosArquivos, criadoEm: agora(), atualizadoEm: "",
      });
      alert("OS salva com sucesso.");
    }

    entrarModoNovo();
    await carregarRegistros();
  } catch (e) {
    console.error("Erro ao salvar:", e);
    alert("Erro ao salvar: " + e.message);
  } finally {
    setLoading(false);
  }
}

// ══════════════════════════════════════════
// REMOVER ARQUIVO / EXCLUIR REGISTRO
// ══════════════════════════════════════════
async function removerArquivo(registroId, indice) {
  if (!confirm("Deseja remover este arquivo?")) return;
  var reg = dados.find(function (r) { return r.id === registroId; });
  if (!reg) return;
  var lista = obterArquivos(reg);
  await excluirArquivoStorage(lista[indice].path);
  var novos = lista.slice();
  novos.splice(indice, 1);
  await colecao.doc(registroId).update({ arquivos: novos, atualizadoEm: agora() });
  await carregarRegistros();
}

async function excluirRegistro(id) {
  var reg = dados.find(function (r) { return r.id === id; });
  if (!reg) return;
  if (!confirm("Deseja excluir a OS " + reg.os + "?")) return;
  var arquivos = obterArquivos(reg);
  for (var i = 0; i < arquivos.length; i++) {
    await excluirArquivoStorage(arquivos[i].path);
  }
  await colecao.doc(id).delete();
  if (editandoId === id) entrarModoNovo();
  await carregarRegistros();
}

// ══════════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════════
function abrirFoto(url) {
  document.getElementById("lightboxImg").src = url;
  document.getElementById("lightbox").classList.add("active");
}

// ══════════════════════════════════════════
// LISTAR / FILTRAR
// ══════════════════════════════════════════
function filtrarLista() {
  var q = document.getElementById("busca").value.toLowerCase().trim();
  var lista = document.getElementById("lista");
  lista.innerHTML = "";

  var filtrados = dados.filter(function (r) {
    return (
      (r.os || "").toLowerCase().includes(q) ||
      (r.cliente || "").toLowerCase().includes(q) ||
      (r.motor || "").toLowerCase().includes(q) ||
      (r.veiculo || "").toLowerCase().includes(q)
    );
  });

  if (!filtrados.length) {
    lista.innerHTML = '<div class="card"><div class="small">Nenhum registro encontrado.</div></div>';
    return;
  }

  filtrados.forEach(function (reg) {
    var div = document.createElement("div");
    div.className = "card record";

    var todosArquivos = obterArquivos(reg);
    var fotos = [], pdfs = [], outros = [];

    todosArquivos.forEach(function (arq, idx) {
      var tipo = arq.tipo || classificarArquivo(arq.mimeType || "");
      var item = Object.assign({}, arq, { idx: idx, tipoFinal: tipo });
      if (tipo === "foto") fotos.push(item);
      else if (tipo === "pdf") pdfs.push(item);
      else outros.push(item);
    });

    var fotosHtml = fotos.length
      ? '<h3>🖼️ Fotos (' + fotos.length + ")</h3>" +
        '<div class="gallery">' +
        fotos.map(function (f) {
          return '<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">' +
            '<img src="' + escapeHtml(f.url) + '" alt="Foto" onclick="abrirFoto(\'' + escapeHtml(f.url) + '\')" title="Clique para ampliar">' +
            '<button class="danger" onclick="removerArquivo(\'' + reg.id + "', " + f.idx + ')">Remover</button></div>';
        }).join("") + "</div>"
      : "";

    var pdfsHtml = pdfs.length
      ? '<h3>📄 PDFs (' + pdfs.length + ")</h3>" +
        '<div class="file-group">' +
        pdfs.map(function (f) {
          return '<div class="file-item"><span class="file-icon">📄</span>' +
            '<a href="' + escapeHtml(f.url) + '" target="_blank" title="' + escapeHtml(f.nome) + '">' + escapeHtml(f.nome) + '</a>' +
            '<span class="small">' + formatarTamanho(f.tamanho) + '</span>' +
            '<button class="danger" onclick="removerArquivo(\'' + reg.id + "', " + f.idx + ')">✕</button></div>';
        }).join("") + "</div>"
      : "";

    var outrosHtml = outros.length
      ? '<h3>📎 Outros arquivos (' + outros.length + ")</h3>" +
        '<div class="file-group">' +
        outros.map(function (f) {
          return '<div class="file-item"><span class="file-icon">' + iconeArquivo("outro", f.nome) + '</span>' +
            '<a href="' + escapeHtml(f.url) + '" target="_blank" title="' + escapeHtml(f.nome) + '">' + escapeHtml(f.nome) + '</a>' +
            '<span class="small">' + formatarTamanho(f.tamanho) + '</span>' +
            '<button class="danger" onclick="removerArquivo(\'' + reg.id + "', " + f.idx + ')">✕</button></div>';
        }).join("") + "</div>"
      : "";

    var temArquivos = fotos.length || pdfs.length || outros.length;
    var arquivosSection = temArquivos
      ? '<div class="files-section">' + fotosHtml + pdfsHtml + outrosHtml + "</div>"
      : '<div class="files-section"><div class="small">Nenhum arquivo anexado.</div></div>';

    div.innerHTML =
      '<div class="record-top"><div>' +
      '<h2 style="margin:0 0 6px;font-size:18px">OS ' + escapeHtml(reg.os || "") + "</h2>" +
      '<div class="small">Criado em: ' + escapeHtml(reg.criadoEm || "-") +
      (reg.atualizadoEm ? " | Atualizado em: " + escapeHtml(reg.atualizadoEm) : "") + "</div></div>" +
      '<div class="actions" style="margin-top:0">' +
      '<button class="primary" onclick="editarRegistro(\'' + reg.id + "'\">Editar</button>" +
      '<button class="danger" onclick="excluirRegistro(\'' + reg.id + "'\">Excluir</button></div></div>" +
      '<div class="meta">' +
      "<div><b>Cliente</b>" + escapeHtml(reg.cliente || "-") + "</div>" +
      "<div><b>Motor</b>" + escapeHtml(reg.motor || "-") + "</div>" +
      "<div><b>Veículo</b>" + escapeHtml(reg.veiculo || "-") + "</div>" +
      "<div><b>Serviço executado</b>" + escapeHtml(reg.servico || "-").replace(/\n/g, "<br>") + "</div></div>" +
      arquivosSection;

    lista.appendChild(div);
  });
}

function editarRegistro(id) {
  var reg = dados.find(function (r) { return r.id === id; });
  if (!reg) return;
  entrarModoEdicao(reg);
}
