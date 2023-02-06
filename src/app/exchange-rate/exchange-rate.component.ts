import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../exchange.service';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss'],
})
export class ExchangeRateComponent implements OnInit {
  curentRateUSD: number | string = 0;
  curentRateEUR: number | string = 0;
  isLoaded = false;

  async ngOnInit(): Promise<void> {
    const fromUSD = { symbol: 'USD', amount: 1 };
    const fromEUR = { symbol: 'EUR', amount: 1 };

    this.curentRateUSD = await ExchangeService.getConversion(fromUSD, 'UAH');
    this.curentRateEUR = await ExchangeService.getConversion(fromEUR, 'UAH');

    this.isLoaded = true;
  }
}
