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
  private currentRate: Promise<StateResponse>;
  private symbols: Promise<SymbolResponse>;
  constructor() {
    const api = new ApiService();

    this.currentRate = api.getCurrentRate();
    this.symbols = api.getAllSymbols();
  }

  private errorHandler = (
    error: (StateResponse | SymbolResponse) | ErrorResponse
  ) => {
    alert(JSON.stringify(error));
  };

  getConversion = async (from: ConvertElement, to: string) => {
    const rateResponse = await this.currentRate;

    if (rateResponse.success) {
      const coeficientFromEUR = rateResponse.rates[to];
      const coeficientToEUR = rateResponse.rates[from.symbol];
      const result = from.amount * (coeficientFromEUR / coeficientToEUR);

      return result.toFixed(2);
    } else {
      this.errorHandler(rateResponse);
      return 0;
    }
  };

  getAllSymbols = async () => {
    const symbolsResponse = await this.symbols;

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
  };
}
