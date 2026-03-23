import { useEffect, useMemo, useRef, useState } from "react"
import "./App.css"

function App() {
  const [valor, setValor] = useState(0)
  const [erro, setErro] = useState("")
  const [status, setStatus] = useState("Sistema pronto")
  const [carregando, setCarregando] = useState(false)
  const [ultimaAcao, setUltimaAcao] = useState("Nenhuma movimentação ainda")
  const [flash, setFlash] = useState("")
  const [historico, setHistorico] = useState([
    { id: 1, tipo: "INFO", texto: "Front iniciado e aguardando sincronização com a API" },
  ])

  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio("/money.mp3")
    audioRef.current.volume = 0.55
    buscarValorInicial()
  }, [])

  const valorFormatado = useMemo(() => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }, [valor])

  function tocarSom() {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  function adicionarHistorico(tipo, texto) {
    setHistorico((estadoAtual) => [
      {
        id: Date.now() + Math.random(),
        tipo,
        texto,
      },
      ...estadoAtual.slice(0, 5),
    ])
  }

  function ativarFlash(tipo) {
    setFlash(tipo)
    setTimeout(() => setFlash(""), 320)
  }

  async function tratarResposta(res) {
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao processar operação.")
    }

    return data
  }

  async function buscarValorInicial() {
    try {
      setCarregando(true)
      setErro("")
      setStatus("Sincronizando caixa com a API...")

      const res = await fetch("http://localhost:8080/contador")
      const data = await tratarResposta(res)

      setValor(data.valor)
      setStatus("API conectada com sucesso")
      setUltimaAcao("Valor carregado do backend")
      adicionarHistorico("GET", `Sincronização inicial concluída com valor ${data.valor}`)
    } catch (err) {
      setErro(err.message)
      setStatus("Falha ao conectar com a API")
      adicionarHistorico("ERRO", err.message)
    } finally {
      setCarregando(false)
    }
  }

  async function aumentar() {
    try {
      setCarregando(true)
      setErro("")
      setStatus("Registrando entrada no caixa...")

      const res = await fetch("http://localhost:8080/contador/aumentar", {
        method: "POST",
      })

      const data = await tratarResposta(res)

      setValor(data.valor)
      setStatus("Entrada confirmada")
      setUltimaAcao("Foi adicionada uma unidade no caixa")
      adicionarHistorico("POST", `Entrada registrada. Novo valor: ${data.valor}`)
      tocarSom()
      ativarFlash("entrada")
    } catch (err) {
      setErro(err.message)
      setStatus("Erro ao registrar entrada")
      adicionarHistorico("ERRO", err.message)
    } finally {
      setCarregando(false)
    }
  }

  async function diminuir() {
    try {
      setCarregando(true)
      setErro("")
      setStatus("Registrando saída no caixa...")

      const res = await fetch("http://localhost:8080/contador/diminuir", {
        method: "POST",
      })

      const data = await tratarResposta(res)

      setValor(data.valor)
      setStatus("Saída confirmada")
      setUltimaAcao("Foi removida uma unidade do caixa")
      adicionarHistorico("POST", `Saída registrada. Novo valor: ${data.valor}`)
      tocarSom()
      ativarFlash("saida")
    } catch (err) {
      setErro(err.message)
      setStatus("Bloqueio de regra de negócio")
      adicionarHistorico("ERRO", err.message)
    } finally {
      setCarregando(false)
    }
  }

  async function resetar() {
    try {
      setCarregando(true)
      setErro("")
      setStatus("Resetando caixa...")

      const res = await fetch("http://localhost:8080/contador/resetar", {
        method: "POST",
      })

      const data = await tratarResposta(res)

      setValor(data.valor)
      setStatus("Caixa resetado")
      setUltimaAcao("O caixa foi zerado com sucesso")
      adicionarHistorico("POST", `Reset executado. Novo valor: ${data.valor}`)
      tocarSom()
      ativarFlash("reset")
    } catch (err) {
      setErro(err.message)
      setStatus("Erro ao resetar caixa")
      adicionarHistorico("ERRO", err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="layout">
      <section className="cash-register-section">
        <div className={`cash-register ${flash ? `flash-${flash}` : ""}`}>
          <div className="register-top">
            <div className="register-brand">
              <span className="brand-dot"></span>
              CashFlow Simulator
            </div>

            <div className="register-screen">
              <span className="screen-label">Saldo contado</span>
              <strong>{valorFormatado}</strong>
              <small>{carregando ? "processando..." : status}</small>
            </div>
          </div>

          <div className="register-middle">
            <div className="money-slot">
              <span>Gaveta do caixa</span>
              <div className="slot-line"></div>
            </div>

            <div className="keyboard-area">
              <div className="numpad">
                {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((numero) => (
                  <button key={numero} className="numpad-key" type="button">
                    {numero}
                  </button>
                ))}
              </div>

              <div className="action-panel">
                <button className="action-button add" type="button" onClick={aumentar} disabled={carregando}>
                  + Entrada
                  <span>POST /contador/aumentar</span>
                </button>

                <button className="action-button remove" type="button" onClick={diminuir} disabled={carregando}>
                  - Saída
                  <span>POST /contador/diminuir</span>
                </button>

                <button className="action-button reset" type="button" onClick={resetar} disabled={carregando}>
                  Resetar Caixa
                  <span>POST /contador/resetar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="register-footer">
            <div className="footer-card">
              <span className="footer-label">Última ação</span>
              <strong>{ultimaAcao}</strong>
            </div>

            <div className="footer-card">
              <span className="footer-label">Conexão</span>
              <strong>Spring Boot + PostgreSQL</strong>
            </div>
          </div>

          {erro && <div className="error-box">{erro}</div>}
        </div>
      </section>

      <aside className="info-section">
        <div className="info-card hero-card">
          <div className="mini-badge">Sobre mim</div>
          <h1>Marcus Vinicius</h1>
          <p>
            Desenvolvedor focado em evoluir na prática, construindo projeto real com backend em Java e agora
            conectando tudo com front-end para fechar o fluxo completo de aplicação.
          </p>
        </div>

        <div className="info-card">
          <h2>Sobre essa API</h2>
          <p>
            Essa interface consome uma API REST feita em <strong>Java + Spring Boot</strong>, persistindo os dados
            em <strong>PostgreSQL</strong> com JPA/Hibernate.
          </p>

          <div className="chips">
            <span>Java</span>
            <span>Spring Boot</span>
            <span>JPA</span>
            <span>Hibernate</span>
            <span>PostgreSQL</span>
            <span>Swagger</span>
            <span>React</span>
            <span>Vite</span>
          </div>
        </div>

        <div className="info-card">
          <h2>Estrutura do backend</h2>
          <ul className="feature-list">
            <li>
              <strong>Entity:</strong> modelagem do contador no banco
            </li>
            <li>
              <strong>Repository:</strong> acesso aos dados com Spring Data JPA
            </li>
            <li>
              <strong>Service:</strong> regras de negócio de aumentar, diminuir e resetar
            </li>
            <li>
              <strong>Controller:</strong> endpoints HTTP expostos para o front
            </li>
            <li>
              <strong>DTO:</strong> resposta limpa, retornando só o valor
            </li>
            <li>
              <strong>Exception + Advice:</strong> erro tratado de forma global
            </li>
          </ul>
        </div>

        <div className="info-card">
          <h2>Resumo do fluxo</h2>
          <div className="timeline">
            <div className="timeline-item">
              <span>1</span>
              <p>O React dispara requisições HTTP para a API.</p>
            </div>
            <div className="timeline-item">
              <span>2</span>
              <p>A controller recebe e envia para a service.</p>
            </div>
            <div className="timeline-item">
              <span>3</span>
              <p>A service aplica a regra de negócio.</p>
            </div>
            <div className="timeline-item">
              <span>4</span>
              <p>O repository persiste no PostgreSQL.</p>
            </div>
            <div className="timeline-item">
              <span>5</span>
              <p>A API responde JSON e o front atualiza a tela.</p>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>Eventos recentes da interface</h2>
          <div className="history-list">
            {historico.map((item) => (
              <div className="history-item" key={item.id}>
                <span className={`history-tag ${item.tipo.toLowerCase()}`}>{item.tipo}</span>
                <p>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  )
}

export default App