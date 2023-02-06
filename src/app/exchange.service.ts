import { Injectable } from '@angular/core';
import {
  ApiService,
  ErrorResponse,
  StateResponse,
  SymbolResponse,
} from './api.service';

export type ConvertElement = {
  amount: number;
  symbol: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  private static errorHandler = (
    error: (StateResponse | SymbolResponse) | ErrorResponse
  ) => {
    alert(JSON.stringify(error));
  };

  static async getConversion(from: ConvertElement, to: string) {
    const rateResponse = await ApiService.getCurrentRate();

    if (rateResponse.success) {
      const coeficientFromEUR = rateResponse.rates[to];
      const coeficientToEUR = rateResponse.rates[from.symbol];
      const result = from.amount * (coeficientFromEUR / coeficientToEUR);

      return result.toFixed(2);
    } else {
      this.errorHandler(rateResponse);
      return 0;
    }
  }

  static async getAllSymbols() {
    const symbolsResponse = await ApiService.getAllSymbols();

    if (symbolsResponse.success) {
      const symbolsArr = Object.entries(symbolsResponse.symbols);

      const reducedValue = symbolsArr.reduce<string[]>((acc, [key, value]) => {
        const string = key + ': ' + value;

        return acc.concat(string);
      }, []);

      return reducedValue;
    } else {
      this.errorHandler(symbolsResponse);
      return ['UAH: Ukrainian Hryvnia'];
    }
  }
}
