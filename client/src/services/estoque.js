import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  orderBy,
  query,
  where,
  increment
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { db, storage } from './firebase'

const itensCol = collection(db, 'itensEstoque')
const movCol = collection(db, 'movimentacoes')

function agora() {
  return new Date().toLocaleString('pt-BR')
}

// ── Itens de Estoque ──

export function gerarIdItem() {
  return doc(itensCol).id
}

export async function carregarItens(filtroTipo = null) {
  let q = query(itensCol, orderBy('nome', 'asc'))
  const snap = await getDocs(q)
  let lista = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  if (filtroTipo) lista = lista.filter(i => i.tipo === filtroTipo)
  return lista
}

export async function buscarItem(id) {
  const snap = await getDoc(doc(db, 'itensEstoque', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function criarItem(id, dados) {
  await setDoc(doc(db, 'itensEstoque', id), {
    nome: dados.nome || '',
    codigo: dados.codigo || '',
    aliases: dados.aliases || [],
    tipo: dados.tipo || 'peca',
    subcategoria: dados.subcategoria || '',
    descricao: dados.descricao || '',
    quantidade: dados.quantidade || 0,
    quantidadeDisponivel: dados.quantidadeDisponivel ?? dados.quantidade ?? 0,
    unidade: dados.unidade || 'un',
    estoqueMinimo: dados.estoqueMinimo || 0,
    custoUnitario: dados.custoUnitario || 0,
    localizacao: dados.localizacao || '',
    fornecedorNome: dados.fornecedorNome || '',
    fornecedorContato: dados.fornecedorContato || '',
    compatibilidade: dados.compatibilidade || [],
    foto: dados.foto || null,
    criadoEm: agora(),
    atualizadoEm: ''
  })
}

export async function atualizarItem(id, dados) {
  await updateDoc(doc(db, 'itensEstoque', id), {
    ...dados,
    atualizadoEm: agora()
  })
}

export function buscarItensTexto(itens, texto) {
  const q = texto.toLowerCase().trim()
  if (!q) return itens
  return itens.filter(item => {
    if ((item.nome || '').toLowerCase().includes(q)) return true
    if ((item.codigo || '').toLowerCase().includes(q)) return true
    if ((item.aliases || []).some(a => a.toLowerCase().includes(q))) return true
    if ((item.subcategoria || '').toLowerCase().includes(q)) return true
    return false
  })
}

// ── Foto do item ──

export async function uploadFotoItem(itemId, file) {
  const nome = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const sRef = storageRef(storage, `estoque/${itemId}/${nome}`)
  const task = uploadBytesResumable(sRef, file)

  return new Promise((resolve, reject) => {
    task.on('state_changed', null, reject, async () => {
      const url = await getDownloadURL(task.snapshot.ref)
      resolve({ url, path: sRef.fullPath })
    })
  })
}

export async function excluirFotoItem(fotoPath) {
  if (!fotoPath) return
  try {
    await deleteObject(storageRef(storage, fotoPath))
  } catch (e) {
    console.warn('Foto não encontrada no storage:', e)
  }
}

// ── Movimentações ──

export function gerarIdMovimentacao() {
  return doc(movCol).id
}

export async function carregarMovimentacoes() {
  const q = query(movCol, orderBy('criadoEm', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function carregarMovimentacoesPorItem(itemId) {
  const q = query(movCol, where('itemId', '==', itemId), orderBy('criadoEm', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function registrarEntrada(dados) {
  const itemRef = doc(db, 'itensEstoque', dados.itemId)
  const movId = gerarIdMovimentacao()

  await setDoc(doc(db, 'movimentacoes', movId), {
    itemId: dados.itemId,
    itemNome: dados.itemNome,
    tipoItem: dados.tipoItem,
    tipoMovimentacao: 'entrada',
    quantidade: dados.quantidade,
    custoUnitario: dados.custoUnitario || 0,
    funcionarioId: '',
    funcionarioNome: '',
    responsavelEntregaId: '',
    responsavelEntregaNome: '',
    ordemId: '',
    ordemNumero: '',
    observacao: dados.observacao || '',
    criadoEm: agora()
  })

  await updateDoc(itemRef, {
    quantidade: increment(dados.quantidade),
    quantidadeDisponivel: increment(dados.quantidade),
    atualizadoEm: agora()
  })

  return movId
}

export async function registrarReserva(dados) {
  const itemRef = doc(db, 'itensEstoque', dados.itemId)
  const item = await buscarItem(dados.itemId)
  if (!item) throw new Error('Item não encontrado')
  if (item.quantidadeDisponivel < dados.quantidade) {
    throw new Error(`Estoque insuficiente. Disponível: ${item.quantidadeDisponivel}`)
  }

  const movId = gerarIdMovimentacao()

  await setDoc(doc(db, 'movimentacoes', movId), {
    itemId: dados.itemId,
    itemNome: dados.itemNome,
    tipoItem: dados.tipoItem,
    tipoMovimentacao: 'reserva',
    quantidade: dados.quantidade,
    custoUnitario: dados.custoUnitario || 0,
    funcionarioId: dados.funcionarioId || '',
    funcionarioNome: dados.funcionarioNome || '',
    responsavelEntregaId: dados.responsavelEntregaId || '',
    responsavelEntregaNome: dados.responsavelEntregaNome || '',
    ordemId: dados.ordemId || '',
    ordemNumero: dados.ordemNumero || '',
    observacao: dados.observacao || '',
    criadoEm: agora()
  })

  await updateDoc(itemRef, {
    quantidadeDisponivel: increment(-dados.quantidade),
    atualizadoEm: agora()
  })

  return movId
}

export async function registrarDevolucao(dados) {
  const itemRef = doc(db, 'itensEstoque', dados.itemId)
  const movId = gerarIdMovimentacao()

  const updates = {
    quantidadeDisponivel: increment(dados.quantidade),
    atualizadoEm: agora()
  }
  if (dados.tipoItem === 'peca') {
    updates.quantidade = increment(dados.quantidade)
  }

  await setDoc(doc(db, 'movimentacoes', movId), {
    itemId: dados.itemId,
    itemNome: dados.itemNome,
    tipoItem: dados.tipoItem,
    tipoMovimentacao: 'devolucao',
    quantidade: dados.quantidade,
    custoUnitario: dados.custoUnitario || 0,
    funcionarioId: dados.funcionarioId || '',
    funcionarioNome: dados.funcionarioNome || '',
    responsavelEntregaId: dados.responsavelEntregaId || '',
    responsavelEntregaNome: dados.responsavelEntregaNome || '',
    ordemId: dados.ordemId || '',
    ordemNumero: dados.ordemNumero || '',
    observacao: dados.observacao || '',
    criadoEm: agora()
  })

  await updateDoc(itemRef, updates)

  return movId
}

// ── Solicitações pendentes ──

export async function carregarSolicitacoesPendentes() {
  const ordensCol = collection(db, 'ordens')
  const snap = await getDocs(ordensCol)
  const solicitacoes = []

  for (const d of snap.docs) {
    const ordem = { id: d.id, ...d.data() }
    const pecas = ordem.pecas || []
    for (const peca of pecas) {
      if (peca.status === 'solicitada') {
        solicitacoes.push({
          ...peca,
          ordemId: ordem.id,
          ordemNumero: ordem.os || ordem.id
        })
      }
    }
  }

  return solicitacoes
}
