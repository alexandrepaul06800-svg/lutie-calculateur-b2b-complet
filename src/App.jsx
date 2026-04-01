import { useState, useRef, useMemo, useEffect } from "react"
import Lottie from "lottie-react"
import "./index.css"
import "./App.css"

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function TooltipUI({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="tooltip-wrapper">
      <button className="tooltip-trigger"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >?</button>
      {open && <span className="tooltip-box">{text}</span>}
    </span>
  )
}

// ─── NumInput ─────────────────────────────────────────────────────────────────
function NumInput({ label, tooltip, suffix, placeholder, value, onChange, error, optional, step, min }) {
  return (
    <div className="input-group">
      <label className="input-label">
        {label}
        {tooltip && <TooltipUI text={tooltip} />}
        {optional && <span className="badge-optional">optionnel</span>}
      </label>
      <div className="input-with-suffix">
        <input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min ?? "0"}
          step={step || "1"}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
}

// ─── SliderInput ──────────────────────────────────────────────────────────────
function SliderInput({ label, value, onChange, min, max, step, suffix, tooltip }) {
  return (
    <div className="input-group">
      <label className="input-label" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}{tooltip && <TooltipUI text={tooltip} />}</span>
        <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{value}{suffix}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="slider-range-labels">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  )
}

// ─── LottieBtn ────────────────────────────────────────────────────────────────
function LottieBtn({ href, children }) {
  const lottieRef1 = useRef(null)
  const lottieRef2 = useRef(null)
  const [animData, setAnimData] = useState(null)
  useEffect(() => { fetch("/lottie-btn.json").then(r => r.json()).then(setAnimData).catch(() => {}) }, [])

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--primary lottie-btn"
      onMouseEnter={() => { lottieRef1.current?.play(); lottieRef2.current?.play() }}
      onMouseLeave={() => { lottieRef1.current?.stop(); lottieRef2.current?.stop() }}
    >
      {animData && <Lottie lottieRef={lottieRef1} animationData={animData} autoplay={false} loop={false} style={{ width: 40, height: 40 }} />}
      <span>{children}</span>
      {animData && <Lottie lottieRef={lottieRef2} animationData={animData} autoplay={false} loop={false} style={{ width: 40, height: 40, transform: "scaleX(-1)" }} />}
    </a>
  )
}

// ─── Funnel visualization ─────────────────────────────────────────────────────
function FunnelBlock({ label, value, sublabel, width, color, isLast }) {
  return (
    <div className="funnel-step">
      <div className="funnel-block-wrapper" style={{ maxWidth: `${width}%` }}>
        <div className="funnel-block" style={{ background: color }}>
          <div className="funnel-value">{value}</div>
          <div className="funnel-label">{label}</div>
        </div>
      </div>
      {sublabel && <div className="funnel-arrow">{sublabel}</div>}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // Core inputs
  const [budget, setBudget] = useState("")
  const [leads, setLeads] = useState("")
  const [tauxQual, setTauxQual] = useState(25)
  const [tauxClosing, setTauxClosing] = useState(20)
  // Optionnel
  const [valeurContrat, setValeurContrat] = useState("")
  const [ltv, setLtv] = useState("")
  const [cyclePanier, setCyclePanier] = useState("")

  const hasCore = budget && leads && Number(budget) > 0 && Number(leads) > 0

  // Erreurs
  const errDeals = hasCore && tauxQual > 0 && tauxClosing > 0
    && Number(leads) * (tauxQual / 100) * (tauxClosing / 100) < 1
    ? "Avec ces taux, tu génères moins d'un deal par mois." : null

  // Calculs
  const calc = useMemo(() => {
    if (!hasCore) return null
    const b = Number(budget)
    const l = Number(leads)
    const tq = tauxQual / 100
    const tc = tauxClosing / 100

    const cpl = b / l
    const leadsQual = l * tq
    const coutLeadQual = leadsQual > 0 ? b / leadsQual : null
    const deals = leadsQual * tc
    const coutDeal = deals > 0 ? b / deals : null

    const vc = valeurContrat ? Number(valeurContrat) : null
    const pipeline = vc ? leadsQual * vc : null
    const caGenere = vc && deals ? deals * vc : null
    const roi = caGenere ? caGenere / b : null
    const ltvV = ltv ? Number(ltv) : null
    const roiLtv = ltvV && deals ? (deals * ltvV) / b : null

    return { cpl, leadsQual, coutLeadQual, deals, coutDeal, pipeline, caGenere, roi, roiLtv, vc }
  }, [budget, leads, tauxQual, tauxClosing, valeurContrat, ltv])

  const formatEur = n => n == null ? "—" : n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €"
  const formatDec = (n, d = 0) => n == null ? "—" : n.toLocaleString("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: d })

  const roiNegatif = calc?.roi != null && calc.roi < 1

  return (
    <div className="tool-wrapper">
      <div className="grain-overlay" />
      <div className="tool-container">

        {/* Header */}
        <header className="tool-header">
          <a href="https://lutie.webflow.io" target="_blank" rel="noopener noreferrer" className="tool-logo">
            <img src="https://cdn.prod.website-files.com/68b6be52d4cf251987cb0b82/68b7ba9e3b082f85f53e7e3e_lutie-logo.svg" alt="Lutie" height="32" />
          </a>
          <h1 className="tool-headline">200 leads/mois. Mais combien de deals — et pour combien d'euros&nbsp;?</h1>
          <p className="tool-subtitle">Entre 4 chiffres. On traduit tes campagnes Google Ads en pipeline réel — et en coût par deal signé.</p>
        </header>

        {/* Core inputs */}
        <div className="card section-card">
          <div className="section-label">Tes chiffres Ads</div>
          <div className="grid-2">
            <NumInput
              label="Budget Ads mensuel (€)"
              placeholder="Ex : 10 000"
              value={budget}
              onChange={setBudget}
              suffix="€"
            />
            <NumInput
              label="Leads générés / mois"
              placeholder="Ex : 200"
              value={leads}
              onChange={setLeads}
            />
          </div>

          {errDeals && <p className="warning-msg">{errDeals}</p>}
        </div>

        {/* Funnel + résultats */}
        {calc && (
          <>
            {/* Entonnoir */}
            <div className="card section-card">
              <div className="section-label">Ton entonnoir Ads → Deals</div>
              <div className="funnel">
                <FunnelBlock
                  label="Budget investi"
                  value={formatEur(Number(budget))}
                  width={100}
                  color="var(--color-primary)"
                  sublabel={`↓ CPL : ${formatEur(calc.cpl)} / lead`}
                />
                <FunnelBlock
                  label="Leads générés"
                  value={Number(leads).toLocaleString("fr-FR")}
                  sublabel={`↓ ${tauxQual}% qualification`}
                  width={90}
                  color="#ffd966"
                />
                <FunnelBlock
                  label="Leads qualifiés"
                  value={formatDec(calc.leadsQual, 1)}
                  sublabel={`↓ ${tauxClosing}% closing`}
                  width={70}
                  color="#ffe599"
                  sublabelExtra={calc.coutLeadQual ? `Coût : ${formatEur(calc.coutLeadQual)}/lead qualifié` : null}
                />
                <FunnelBlock
                  label="Deals signés"
                  value={formatDec(calc.deals, 1)}
                  width={50}
                  color="var(--color-primary-bg)"
                  isLast
                />
              </div>

              {/* Coût par deal — the aha moment */}
              <div className="cost-deal-hero">
                <div className="cost-deal-label">Coût par deal signé</div>
                <div className="cost-deal-value">{formatEur(calc.coutDeal)}</div>
                {calc.vc && calc.roi != null && (
                  <p className="cost-deal-context">
                    Ton contrat moyen vaut {formatEur(calc.vc)} → ROI ×{formatDec(calc.roi, 1)}
                  </p>
                )}
              </div>

              {/* Teaser Vue Direction */}
              {!valeurContrat && (
                <div className="unlock-teaser">
                  🔓 Entre la valeur d'un contrat ci-dessous pour voir le <strong>ROI et pipeline mensuel</strong>.
                </div>
              )}
            </div>

            {/* Vue Marketing */}
            <div className="card section-card">
              <div className="section-label">Vue Marketing — cascade du coût</div>
              <div className="cascade">
                <div className="cascade-item">
                  <div className="cascade-num">{formatEur(calc.cpl)}</div>
                  <div className="cascade-label">CPL (coût par lead)</div>
                </div>
                <div className="cascade-arrow">→</div>
                <div className="cascade-item">
                  <div className="cascade-num">{formatEur(calc.coutLeadQual)}</div>
                  <div className="cascade-label">Coût par lead qualifié</div>
                </div>
                <div className="cascade-arrow">→</div>
                <div className="cascade-item cascade-item--highlight">
                  <div className="cascade-num">{formatEur(calc.coutDeal)}</div>
                  <div className="cascade-label">Coût par deal signé</div>
                </div>
              </div>
            </div>

            {/* Vue Direction */}
            {valeurContrat && (
              <div className={`card section-card ${roiNegatif ? "card--alert" : "card--highlight"}`}>
                <div className="section-label">Vue Direction — impact business</div>
                <div className="direction-grid">
                  <div className="direction-item">
                    <div className="direction-label">Pipeline brut</div>
                    <div className="direction-value">{formatEur(calc.pipeline)}</div>
                  </div>
                  <div className="direction-item">
                    <div className="direction-label">CA généré estimé</div>
                    <div className="direction-value">{formatEur(calc.caGenere)}</div>
                  </div>
                  <div className="direction-item">
                    <div className="direction-label">ROI Ads</div>
                    <div className={`direction-value ${roiNegatif ? "val-neg" : "val-pos"}`}>
                      {calc.roi != null ? `×${formatDec(calc.roi, 1)}` : "—"}
                    </div>
                  </div>
                  {calc.roiLtv && (
                    <div className="direction-item">
                      <div className="direction-label">ROI sur LTV</div>
                      <div className="direction-value val-pos">×{formatDec(calc.roiLtv, 1)}</div>
                    </div>
                  )}
                </div>
                {roiNegatif && (
                  <p className="warning-msg" style={{ marginTop: "var(--space-md)" }}>
                    ⚠️ Tes campagnes ne couvrent pas leur coût avec ces taux. Le problème est souvent le taux de qualification ou de closing — pas le CPL.
                  </p>
                )}
              </div>
            )}

            {/* Simulation sliders */}
            <div className="card section-card">
              <div className="section-label">Simulation — que se passe-t-il si tu améliores les taux ?</div>
              <p className="expand-intro">Joue sur les taux pour voir l'impact en temps réel.</p>
              <div className="grid-2">
                <SliderInput
                  label="Taux de qualification"
                  value={tauxQual}
                  onChange={setTauxQual}
                  min={1}
                  max={100}
                  step={1}
                  suffix="%"
                />
                <SliderInput
                  label="Taux de closing"
                  value={tauxClosing}
                  onChange={setTauxClosing}
                  min={1}
                  max={100}
                  step={1}
                  suffix="%"
                />
              </div>
              <div className="grid-2">
                <NumInput
                  label="Valeur moyenne d'un contrat (€)"
                  placeholder="Ex : 8 000"
                  value={valeurContrat}
                  onChange={setValeurContrat}
                  suffix="€"
                  optional
                />
                <NumInput
                  label="LTV estimée par client (€)"
                  tooltip="Valeur totale d'un client sur sa durée de vie. Permet de calculer le ROI long terme."
                  placeholder="Ex : 24 000"
                  value={ltv}
                  onChange={setLtv}
                  suffix="€"
                  optional
                />
              </div>
              {calc.caGenere && (
                <div className="simulation-phrase">
                  Avec {tauxQual}% de qualification et {tauxClosing}% de closing → <strong>{formatDec(calc.deals, 1)} deals</strong> / mois pour <strong>{formatEur(calc.caGenere)}</strong> de CA.
                </div>
              )}
            </div>
          </>
        )}

        {/* CTA */}
        {calc && (
          <div className="cta-section">
            <p className="cta-text">Tu veux qu'on analyse tes campagnes sous cet angle&nbsp;?</p>
            <LottieBtn href="https://lutie.webflow.io/contact">
              On en parle — audit offert
            </LottieBtn>
            <p className="cta-sub">Réponse sous 24h · Sans engagement</p>
          </div>
        )}

        <footer className="tool-footer">
          <p>Outil gratuit par <a href="https://lutie.webflow.io" target="_blank" rel="noopener noreferrer">Lutie</a> — Agence Google Ads & Meta Ads</p>
        </footer>
      </div>
    </div>
  )
}
