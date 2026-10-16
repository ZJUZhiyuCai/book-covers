// A reusable fresh-generation recipe, kept distinct from the historical edit record.
export function reusablePrompt(original, revised = false) {
  return (
    original.trimEnd() +
    (revised
      ? '\n\nFinal composition requirement for this fresh generation: preserve an uninterrupted warm-ivory author margin across the bottom 9% of the image. Keep the narrative illustration above that margin. No lettering anywhere. This recipe incorporates the margin correction made to the selected artwork; it does not guarantee identical pixels.'
      : '') +
    '\n'
  );
}
