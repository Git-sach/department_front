export class Color {
  private readonly _value: string;

  constructor(hexaValue: string) {
    this._value = hexaValue;
  }

  public get valueHexa(): string {
    return this._value;
  }

  public get valueDecimal(): number {
    return parseInt(this._value, 16);
  }

  public get redCompositionDecimal(): number {
    return parseInt(this._value.substring(0, 2), 16);
  }

  public get greenCompositionDecimal(): number {
    return parseInt(this._value.substring(2, 4), 16);
  }

  public get blueCompositionDecimal(): number {
    return parseInt(this._value.substring(4, 6), 16);
  }

  private decimalToHexa = function (number: number) {
    let numberString = number.toString(16);
    return numberString.length === 1 ? '0' + numberString : numberString;
  };

  /**
   * Permet de créer un gradiant de couleurs avec une autre conleur.
   * La valeure retournée est un tableau avec:
   *  -> en première valeur, la couleure 'faible'
   *  -> en dernière valeur, la couleure 'forte'
   *  -> entre les deux, le gradient de couleur
   *
   * L'ordre des couleurs n'est pas importent
   *
   * @param color la couleur avec laquelle réaliser le gradient
   * @param numberOfColors le nombre de couleur souhaité entre les deux couleurs
   * @returns le tableau de Couleur
   */
  public creatGradient(color: Color, numberOfColors: number = 1): Color[] {
    const rMin =
      this._value < color._value
        ? this.redCompositionDecimal
        : color.redCompositionDecimal;

    const gMin =
      this._value < color._value
        ? this.greenCompositionDecimal
        : color.greenCompositionDecimal;

    const bMin =
      this._value < color._value
        ? this.blueCompositionDecimal
        : color.blueCompositionDecimal;

    const rMax =
      this._value < color._value
        ? color.redCompositionDecimal
        : this.redCompositionDecimal;

    const gMax =
      this._value < color._value
        ? color.greenCompositionDecimal
        : this.greenCompositionDecimal;

    const bMax =
      this._value < color._value
        ? color.blueCompositionDecimal
        : this.blueCompositionDecimal;

    let gradient: Color[] = [];

    this._value < color._value ? gradient.push(this) : gradient.push(color);

    for (let i = 0; i < numberOfColors - 2; i++) {
      const r = Math.round(
        ((rMax - rMin) / (numberOfColors + 1)) * (i + 1) + rMin
      );
      const g = Math.round(
        ((gMax - gMin) / (numberOfColors + 1)) * (i + 1) + gMin
      );
      const b = Math.round(
        ((bMax - bMin) / (numberOfColors + 1)) * (i + 1) + bMin
      );

      gradient.push(
        new Color(
          `${this.decimalToHexa(r)}${this.decimalToHexa(g)}${this.decimalToHexa(
            b
          )}`
        )
      );
    }

    this._value < color._value ? gradient.push(color) : gradient.push(this);

    return gradient;
  }
}
