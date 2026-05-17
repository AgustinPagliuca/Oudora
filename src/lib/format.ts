const ARS_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatArs(value: number): string {
  return ARS_FORMATTER.format(value);
}

export function formatVolume(volumeMl: number): string {
  return `${volumeMl} ml`;
}

export function formatPresentation(concentration: string, volumeMl: number): string {
  return `${concentration} · ${formatVolume(volumeMl)}`;
}
