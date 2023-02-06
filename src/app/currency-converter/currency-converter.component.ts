import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConvertElement, ExchangeService } from '../exchange.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent {
  defualtCyrrency = 'UAH: Ukrainian Hryvnia';
  supportingCurrency = [this.defualtCyrrency, this.defualtCyrrency];
  isLoadingCurrency = true;

  firstInput = this.fb.group({
    inputValue: 1,
    currency: this.defualtCyrrency,
  });
  secondInput = this.fb.group({
    inputValue: 1,
    currency: this.defualtCyrrency,
  });

  constructor(private fb: FormBuilder) {
    ExchangeService.getAllSymbols()
      .then((res) => (this.supportingCurrency = res))
      .finally(() => (this.isLoadingCurrency = false));
  }

  handleChange = async (inputName: 'firstInput' | 'secondInput') => {
    const otherInputName =
      inputName === 'firstInput' ? 'secondInput' : 'firstInput';

    const to =
      this[otherInputName].value.currency?.split(':')[0] ||
      this.defualtCyrrency;
    const from: ConvertElement = {
      amount: this[inputName].value.inputValue || 0,
      symbol: this[inputName].value.currency?.split(':')[0] || to,
    };

    const result = await ExchangeService.getConversion(from, to);

    this[otherInputName].patchValue({ inputValue: Number(result) });
  };
}
