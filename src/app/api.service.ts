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
  private API_KEY = 'IxMr5d5DtlW3bP4BngJKEYQWzkDRAEdi';
  private BASE_URL = 'https://api.apilayer.com/exchangerates_data';
  constructor() {}

  private handleError = (error: {}) => {
    console.error('Fetch error ', error);

    return Object.assign(error, { success: null }) as ErrorResponse;
  };

  private fetchData = async <T>(
    query: QueryList,
    init?: RequestInit | undefined
  ) => {
    const headers = new Headers();
    const options = { ...init, headers };

    headers.append('apikey', this.API_KEY);

    return fetch(`${this.BASE_URL}${query}`, options).then((res) =>
      res.json()
    ) as Promise<T>;
  };

  getAllSymbols = () =>
    this.fetchData<SymbolResponse>('/symbols').catch(this.handleError);

  getCurrentRate = () =>
    this.fetchData<StateResponse>('/latest').catch(this.handleError);
}
