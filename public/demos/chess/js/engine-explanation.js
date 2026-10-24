import { Chess } from '../vendor/chess.js';

// Explain only what the board and engine measurements establish.
export function engineExplanation(review) {
  const line = [];
  try {
    const board = new Chess(review.fen);
    for (const uci of review.bestLine.split(/\s+/).filter(Boolean)) {
      const move = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      if (!move) break;
      line.push(move.san);
    }
  } catch { /* A partial legal line still helps; never display unverified moves. */ }
  const loss = Math.max(0, review.centipawnLoss) / 100;
  const measured = review.evalBefore.startsWith('M') || review.evalBefore.startsWith('-M') ||
    review.evalAfter.startsWith('M') || review.evalAfter.startsWith('-M')
    ? `The engine evaluation changed from ${review.evalBefore} to ${review.evalAfter} (White's perspective; M means mate).`
    : `The evaluation moved from ${review.evalBefore} to ${review.evalAfter} pawns (positive favors White).`;
  const difference = loss >= 0.2 && !/M/.test(review.evalBefore + review.evalAfter)
    ? ` That is about ${loss.toFixed(1)} pawns lost from ${review.color}'s perspective.` : '';
  const continuation = line.length ? ` The engine's suggested continuation before this move was ${line.join(' → ')}.` : '';
  return `${review.color} played ${review.san}: ${review.verdict.toLowerCase()} at this analysis depth. ${measured}${difference}${continuation}`;
}
