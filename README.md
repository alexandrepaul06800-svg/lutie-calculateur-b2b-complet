# Outil C+O — Calculateur B2B : du budget Ads au deal signé

## Nom public
**"Combien mes campagnes rapportent vraiment ?"**
Slug suggéré : `/outils/calculateur-b2b`

## Résumé
Traduit le budget Google Ads en revenus pipeline et en coût par deal signé, en passant par l'entonnoir complet leads → qualification → closing. Parle simultanément le langage du marketing (CPL, leads) et celui de la direction (pipeline, CA, ROI).

## Cible principale
Profil 2 — Scale-up / PME B2B en génération de leads (SaaS, services B2B, conseil, formation, logiciel métier)

## Douleur adressée
Marketing, commercial et direction regardent des métriques différentes et ne se comprennent pas :
- Le marketing défend son CPL et son volume de leads.
- Le commercial se plaint de la qualité des leads.
- La direction demande le ROI de la dépense Ads.

Personne ne fait le pont. Résultat : les campagnes sont jugées mauvaises sans qu'on sache vraiment pourquoi.

## Accroche
> "200 leads/mois à 50€ le lead. Mais combien ça te rapporte vraiment — et combien te coûte un deal signé ?"

## Comment ça marche

### Inputs
| Champ | Type | Exemple | Requis |
|---|---|---|---|
| Budget Ads mensuel | € | 10 000 € | Oui |
| Leads générés / mois | nombre | 200 | Oui |
| Taux de qualification | % | 25% | Oui |
| Taux de closing | % | 20% | Oui |
| Valeur moyenne d'un contrat | € | 8 000 € | Oui |
| LTV estimée | € | 24 000 € | Optionnel |
| Durée du cycle de vente | mois | 2 | Optionnel |

### Calcul — séquence complète
```
CPL = budget / leads
leads_qualifiés = leads × (taux_qualification / 100)
coût_par_lead_qualifié = budget / leads_qualifiés
deals_signés = leads_qualifiés × (taux_closing / 100)
coût_par_deal = budget / deals_signés
pipeline_brut = leads_qualifiés × valeur_contrat
CA_généré = deals_signés × valeur_contrat
ROI = CA_généré / budget
// Si LTV fournie :
ROI_LTV = (deals_signés × LTV) / budget
```

### Outputs

**Visualisation entonnoir (vertical ou horizontal)**
```
Budget 10 000€
    ↓
200 leads | CPL : 50€
    ↓ 25% qualification
50 leads qualifiés | Coût : 200€/lead qualifié
    ↓ 20% closing
10 deals signés | Coût par deal : 1 000€
    ↓
CA généré : 80 000€ | ROI : ×8
```

**Vue Marketing** (onglet ou section)
- CPL → Coût par lead qualifié → Coût par deal (3 chiffres en cascade)

**Vue Direction** (onglet ou section)
- Pipeline brut en cours : X€
- CA généré estimé : Y€
- ROI : "1€ investi = Z€ de CA"

**Simulation interactive**
- Sliders sur taux de qualification et taux de closing
- Recalcul en temps réel de tous les outputs
- Phrase d'impact auto-générée : "Si ton taux de closing passe de 20% à 30%, le CA généré passe de 80 000€ à 120 000€."

**Export**
- Bouton "Copier le résumé" → copie dans le presse-papier un texte formaté avec les chiffres clés

## UX & Copywriting

### Headline
> "200 leads/mois. Mais combien de deals — et pour combien d'euros ?"

### Sous-titre
> "Entre 4 chiffres. On traduit tes campagnes Google Ads en pipeline réel — et en coût par deal signé."

### Structure progressive
**Core visible (4 inputs)** : budget / leads / taux qualification / taux closing → entonnoir + coût par deal immédiatement
**Enrichissement progressif** : valeur contrat → CA généré apparaît. LTV et cycle de vente optionnels.

### Labels & placeholders
- "Ton budget Google Ads mensuel (€)" — placeholder : "Ex : 10 000"
- "Leads générés ce mois" — placeholder : "Ex : 200"
- "% de leads transmis à tes commerciaux" — placeholder : "Ex : 25" — tooltip : "Sur 100 leads, combien méritent vraiment un appel commercial ?"
- "% de leads qualifiés qui signent" — placeholder : "Ex : 20"
- "Valeur moyenne d'un contrat signé (€)" — placeholder : "Ex : 8 000" — label optionnel

### Aha moment
Le coût par deal signé en très grand. "Chaque deal signé te coûte **1 200€** en Ads." Ce chiffre mis en contexte : "Ton contrat moyen vaut 8 000€ → ROI ×6.7."

### Layout résultats
Les deux vues (marketing / direction) sur la même page, l'une sous l'autre — pas de toggle. Le fondateur voit les deux d'un seul scroll.

### Règles UX
- L'entonnoir visuel se construit en temps réel à chaque input
- Sliders sur les taux après le premier résultat pour simuler des améliorations
- CTA texte : "Tu veux qu'on analyse ton funnel complet ?"

## Edge cases
- Leads = 0 → bloquer le calcul, message d'erreur
- Taux qualification ou closing = 0% → "0 deal signé — tes campagnes ne génèrent pas de revenu avec ces taux"
- Deals signés < 1 → afficher en décimales ET préciser "soit moins d'un deal par mois en moyenne"
- CA généré < Budget → alerte "Tes campagnes ne couvrent pas leur coût avec ces taux"

## Angle différenciant
Un seul outil qui réconcilie les trois langages sur un seul écran. Montre que le problème n'est pas le budget ou le CPL — c'est souvent le taux de qualification ou de closing.

## Stack technique
- Vite + React
- CSS pur (pas de Tailwind — suivre la charte graphique Lutie)
- Calcul en temps réel via useState / useEffect
- Pas de backend, pas de routing (single component app)

## Design & UI
Respecter la charte graphique Lutie (`CHARTE_GRAPHIQUE_LUTIE.md`) :
- Entonnoir : visualisation en blocs empilés, couleur principale `#fcb800`
- Chiffres clés (coût par deal, ROI) : grand format, gras
- Toggle Vue marketing / Vue direction : boutons secondaires
- Sliders : couleur de remplissage `#fcb800`
- Alerte ROI négatif : fond `#f2f1ff`

## CTA
Texte : "Tu veux qu'on analyse tes campagnes sous cet angle ?"
Destination : page de prise de contact / calendly Lutie

## Statut
- [ ] Maquette
- [ ] Développement
- [ ] Mise en ligne
