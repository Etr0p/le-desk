/**
 * Bibliothèque de référence du module Gestion d'actifs & risques.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Pourcentages partout (5 = 5 %) ; aucun arrondi interne. Les POIDS de
 *   portefeuille se passent en % (60 = 60 %) ; le complément à 100 est
 *   investi dans le second actif.
 * — Les corrélations ρ et les bêtas sont SANS UNITÉ (ρ dans [−1, 1]).
 * — Les ratios (Sharpe, information) sont SANS UNITÉ — des rendements en %
 *   divisés par des volatilités en %.
 * — Les valeurs de portefeuille et de bilan se passent en MILLIONS ; la VaR
 *   se rend en MILLIONS. Année de 252 jours de bourse (convention desk).
 * — La VaR paramétrique prend le quantile z EXPLICITE (1,65 pour 95 %,
 *   2,33 pour 99 % — les arrondis d'usage) : le choix du seuil est une
 *   décision de gestion, pas une constante cachée.
 * — Le pont quantitatif avec le m2 (volatilité, corrélation, quantiles de
 *   la normale) et le m3 (indices) s'IMPORTE conceptuellement — les
 *   chapitres renvoient, les fonctions ne recopient pas leurs contenus.
 *
 * Toutes les fonctions sont verrouillées dans calculs.test.ts par des
 * valeurs de référence vérifiées à la main : vol de portefeuille
 * (60/40, 20/10, ρ 0,3) = 13,740451 % — et 16 % exactement à ρ = 1 (la
 * moyenne pondérée, plus aucune diversification) ; β(0,8, 25, 15) =
 * 1,333333 ; CAPM(3, 1,2, 5) = 9 % ; alpha(12, 3, 1,2, 10) = 0,6 % ;
 * Sharpe(8, 3, 10) = 0,5 ; VaR 1 j 95 % (100 M, 20 %) = 2,078805 M ;
 * √10 × 2 = 6,324555 ; CET1(12, 100) = 12 % ; 100 investis 30 ans à 7 %
 * brut = 761,225504 mais 432,194238 net de 2 % de frais — les frais coûtent
 * 329,031266, presque trois fois la mise. Les générateurs d'exercices
 * DEVRONT composer ces fonctions, jamais recopier une formule.
 */

// ───────────────────────── Le portefeuille : rendement et risque ─────────────────────────

/**
 * Rendement espéré d'un portefeuille de deux actifs : moyenne pondérée,
 * w₁·r₁ + (1 − w₁)·r₂, poids en %. (60, 8, 3) = 6 %. Le rendement se
 * diversifie LINÉAIREMENT — c'est le risque qui ne le fait pas, et tout
 * Markowitz tient dans cette asymétrie (ch. 1).
 */
export function rendementPortefeuille2Actifs(poids1Pct: number, rendement1Pct: number, rendement2Pct: number): number {
  const w1 = poids1Pct / 100;
  return w1 * rendement1Pct + (1 - w1) * rendement2Pct;
}

/**
 * Volatilité d'un portefeuille de deux actifs :
 * √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂), poids en %, volatilités en %.
 * LA formule du module. (60, 20, 10, ρ 0,3) = 13,740451 % — MOINS que la
 * moyenne pondérée 16 % : l'écart est le seul repas gratuit de la finance.
 * À ρ = 1, la formule rend exactement la moyenne pondérée (16 %) : plus
 * aucune diversification ; à ρ = −1, (60, 20, 10) tombe à 8 % — et un choix
 * de poids annulerait tout le risque. À ρ = 0, deux actifs identiques à
 * 20 % de vol en 50/50 rendent 14,142136 % : diviser par √2.
 */
export function volatilitePortefeuille2Actifs(poids1Pct: number, vol1Pct: number, vol2Pct: number, correlation: number): number {
  const w1 = poids1Pct / 100;
  const w2 = 1 - w1;
  return Math.sqrt(
    w1 * w1 * vol1Pct * vol1Pct +
    w2 * w2 * vol2Pct * vol2Pct +
    2 * w1 * w2 * correlation * vol1Pct * vol2Pct,
  );
}

// ───────────────────────── CAPM : le prix du risque systématique ─────────────────────────

/**
 * Bêta d'un actif contre le marché : β = ρ · σ_actif / σ_marché.
 * (0,8, 25, 15) = 1,333333. Le bêta ne mesure PAS le risque total : un
 * actif très volatil mais décorrélé (ρ ≈ 0) a un bêta minuscule — son
 * risque est diversifiable, donc non rémunéré selon le CAPM (ch. 2).
 */
export function betaActif(correlationAvecMarche: number, volActifPct: number, volMarchePct: number): number {
  return correlationAvecMarche * volActifPct / volMarchePct;
}

/**
 * Rendement exigé par le CAPM : r = r_f + β × prime de marché, tout en %.
 * (3, 1,2, 5) = 9 %. La droite de marché des titres (SML) : on n'est payé
 * que pour le risque SYSTÉMATIQUE — le reste, le marché suppose que vous
 * l'avez diversifié. Repères : prime de marché actions ~4-6 %/an sur
 * longue période (ch. 2).
 */
export function rendementCapm(tauxSansRisquePct: number, beta: number, primeMarchePct: number): number {
  return tauxSansRisquePct + beta * primeMarchePct;
}

/**
 * Alpha de Jensen : rendement réalisé − rendement exigé par le CAPM,
 * r − [r_f + β(r_m − r_f)], tout en %. (12, 3, 1,2, 10) = +0,6 % : le
 * gérant a battu SON risque, pas seulement le marché. L'alpha est ce qui
 * reste quand on a payé le bêta — la denrée la plus chère et la plus rare
 * du buy-side (ch. 3).
 */
export function alphaJensen(rendementRealisePct: number, tauxSansRisquePct: number, beta: number, rendementMarchePct: number): number {
  return rendementRealisePct - (tauxSansRisquePct + beta * (rendementMarchePct - tauxSansRisquePct));
}

// ───────────────────────── Mesurer la performance ─────────────────────────

/**
 * Ratio de Sharpe : (r − r_f)/σ, sans unité. (8, 3, 10) = 0,5 — l'excès de
 * rendement PAR unité de risque total. Repères d'usage : ~0,3-0,5 pour un
 * portefeuille actions passif sur longue période, > 1 excellent, > 2 à
 * regarder avec soupçon (levier, risque caché, fenêtre choisie — LTCM
 * affichait > 4 avant 1998, renvoi m11 ch. 3).
 */
export function ratioSharpe(rendementPct: number, tauxSansRisquePct: number, volatilitePct: number): number {
  return (rendementPct - tauxSansRisquePct) / volatilitePct;
}

/**
 * Ratio d'information : surperformance vs indice / tracking error, sans
 * unité. (2, 4) = 0,5. Le Sharpe du gérant ACTIF : combien d'écart au
 * benchmark chaque unité d'écart-type d'écart rapporte. > 0,5 sur durée
 * longue est déjà très bon ; la tracking error, elle, se CHOISIT — c'est
 * le budget de liberté du mandat (ch. 3).
 */
export function ratioInformation(surperformancePct: number, trackingErrorPct: number): number {
  return surperformancePct / trackingErrorPct;
}

// ───────────────────────── VaR et stress ─────────────────────────

/**
 * VaR paramétrique (normale) en MILLIONS : V × z × σ_annuelle × √(h/252),
 * valeur en millions, vol annuelle en %, z explicite (1,65 pour 95 %,
 * 2,33 pour 99 %), horizon en jours de bourse. (100, 20, 1,65, 1 j) =
 * 2,078805 M : « on ne devrait pas perdre plus de ~2,1 M en un jour, 19
 * jours sur 20 ». La VaR dit le seuil, JAMAIS la perte au-delà — c'est sa
 * limite fondatrice (ch. 5), et pourquoi on lui adjoint stress tests et
 * expected shortfall.
 */
export function varParametrique(valeurMillions: number, volAnnuellePct: number, quantileZ: number, horizonJours: number): number {
  return valeurMillions * quantileZ * (volAnnuellePct / 100) * Math.sqrt(horizonJours / 252);
}

/**
 * Extension d'une VaR à un horizon plus long : VaR_h = VaR_1j × √h (racine
 * du temps, rendements i.i.d.). (2, 10) = 6,324555 M — la convention
 * réglementaire historique (Bâle exigeait la VaR 10 jours = 1 j × √10).
 * L'hypothèse casse précisément en crise, quand les pertes s'auto-
 * corrèlent : la racine du temps est un plafond optimiste (ch. 5).
 */
export function varHorizon(varUnJourMillions: number, horizonJours: number): number {
  return varUnJourMillions * Math.sqrt(horizonJours);
}

/**
 * Perte d'un stress test « bêta » en MILLIONS, SIGNÉE : V × choc × β / 100.
 * (100, −20, 1,2) = −24 M : un portefeuille de bêta 1,2 dans un −20 % de
 * marché. Le stress test complète la VaR : pas de probabilité, un SCÉNARIO
 * — on rejoue 1987, 2008, COVID (renvoi m11) et on regarde le bilan tenir
 * ou pas. C'est volontairement fruste : la vertu est dans la question,
 * pas dans le raffinement du modèle (ch. 5).
 */
export function perteStressMillions(valeurMillions: number, chocMarchePct: number, beta: number): number {
  return valeurMillions * chocMarchePct * beta / 100;
}

// ───────────────────────── Bâle III : le capital et la liquidité ─────────────────────────

/**
 * Actifs pondérés du risque (RWA) en MILLIONS : exposition × pondération.
 * (100, 75) = 75 M. La pondération encode le risque réglementaire : ~0 %
 * pour du souverain AAA, 20-50 % pour des banques/corporates bien notés,
 * 75 % pour la clientèle de détail, 100 %+ pour le reste — le lien direct
 * avec la notation du m5 (ch. 6).
 */
export function actifsPonderesRisqueMillions(expositionMillions: number, ponderationPct: number): number {
  return expositionMillions * ponderationPct / 100;
}

/**
 * Ratio de capital CET1 en % : fonds propres durs / RWA × 100.
 * (12, 100) = 12 %. Bâle III exige 4,5 % de CET1 + coussins (conservation
 * 2,5 %, systémique…) — les grandes banques européennes vivent à 12-15 %.
 * À comparer au levier ~31 de Lehman (m11) : c'est LA réponse
 * réglementaire à 2008 — plus de capital, de meilleure qualité (ch. 6).
 */
export function ratioCet1Pct(fondsPropresDursMillions: number, rwaMillions: number): number {
  return (fondsPropresDursMillions / rwaMillions) * 100;
}

/**
 * LCR (liquidity coverage ratio) en % : actifs liquides de haute qualité /
 * sorties nettes de trésorerie à 30 jours de stress × 100. (120, 100) =
 * 120 % — il faut ≥ 100 % : survivre un mois de run SANS banque centrale.
 * La leçon directe de 2008 (Northern Rock, repo) et de SVB 2023 (m11
 * ch. 7) : la solvabilité ne protège pas de l'illiquidité (ch. 6).
 */
export function lcrPct(actifsLiquidesMillions: number, sortiesNettes30jMillions: number): number {
  return (actifsLiquidesMillions / sortiesNettes30jMillions) * 100;
}

// ───────────────────────── L'arithmétique des frais ─────────────────────────

/**
 * Valeur finale d'un capital après n années au rendement brut r diminué de
 * frais annuels f : C × (1 + (r − f)/100)^n. L'argument massue du débat
 * passif/actif (ch. 4) : 100 investis 30 ans à 7 % brut font 761,225504 ;
 * avec 2 % de frais annuels, 432,194238 — les frais ont coûté 329,031266,
 * plus de trois fois la mise de départ, SANS qu'aucune année ne semble
 * chère. Un ETF à 0,2 % laisse 719,676929. La composition travaille pour
 * celui qui encaisse les frais aussi sûrement que pour l'investisseur.
 */
export function valeurNetteDeFrais(capitalInitial: number, rendementBrutPct: number, fraisAnnuelsPct: number, annees: number): number {
  return capitalInitial * Math.pow(1 + (rendementBrutPct - fraisAnnuelsPct) / 100, annees);
}
