import type { Stat as StatType } from "payload/generated-custom-types";

export function formatValue(stat: StatType, val: number): string {
  switch (stat.fmt) {
    case "{0:0.#%}":
      return (1 * (val * 100).toFixed(1)).toString() + "%";
    case "{0:0.#}":
      return (val % 1 === 0) ? val.toString() : val.toFixed(1);
    case "{0:0}":
      return Math.round(val).toString();
    case "{0:0.##}":
      return (val % 1 === 0) ? val.toString() : (1 * val.toFixed(2)).toString();
  }
  return val.toString();
}
