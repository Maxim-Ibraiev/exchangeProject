import { Injectable } from '@angular/core';

type SuccessStateResponse = {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key in string]: number;
  };
  error: undefined;
};

type SuccessSymbolResponse = {
  success: boolean;
  symbols: {
    [key in string]: string;
  };
};

export type ErrorResponse = {
  success: null;
  error: {
    code: string;
    message: string;
  };
};

export type StateResponse = SuccessStateResponse | ErrorResponse;
export type SymbolResponse = SuccessSymbolResponse | ErrorResponse;

type QueryList = '/symbols' | '/latest';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private static API_KEY = 'IxMr5d5DtlW3bP4BngJKEYQWzkDRAEdi';
  private static BASE_URL = 'https://api.apilayer.com/exchangerates_data';
  private static cachedState: SuccessStateResponse;
  private static cachedSymbol: SuccessSymbolResponse;

  private static handleError(error: {}) {
    console.error('Fetch error ', error);

    return Object.assign(error, { success: null }) as ErrorResponse;
  }

  private static fetchData<T>(
    query: QueryList,
    init?: RequestInit | undefined
  ) {
    const headers = new Headers();
    const options = { ...init, headers };

    headers.append('apikey', this.API_KEY);

    return fetch(`${this.BASE_URL}${query}`, options)
      .then((res) => res.json() as Promise<T>)
      .catch(this.handleError);
  }

  static async getCurrentRate() {
    if (this.cachedState) return this.cachedState;

    const response = await this.fetchData<StateResponse>('/latest');

    if (response.success) this.cachedState = response;

    return response;
  }

  static async getAllSymbols() {
    if (this.cachedSymbol) return this.cachedSymbol;

    const response = await this.fetchData<SymbolResponse>('/symbols');

    if (response.success) this.cachedSymbol = response;

    return response;
  }
}
