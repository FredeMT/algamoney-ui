import { ErrorHandlerService } from './../../core/error-handler.service';
import { DashboardService } from './../dashboard.service';
import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartData: any;
  lineChartData: any;
  mesReferencia = new Date(2018, 0 , 20); // Data usada para pegar o mes de referencia, 0 = janeiro.

  /* Objeto que armazena as propriedades de customização dos gráficos.
    vide documentação do chart.js */
  options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const valor = dataset.data[tooltipItem.index];
          const label = dataset.label ? (dataset.label + ': ') : '';

          return label + this.decimalPipe.transform(valor, '1.2-2');
        }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private errorHandler: ErrorHandlerService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit() {
    this.configurarGraficoPizza();
    this.configurarGraficoLinha(this.mesReferencia);
  }

  configurarGraficoPizza() {
    this.dashboardService.lancamentosPorCategoria()
    .then(dados => {
      this.pieChartData = {
        labels: dados.map(dado => dado.categoria.nome),
        datasets: [
          {
            data: dados.map(dado => dado.total),
            backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
            '#DD4477', '#3366CC', '#DC3912']
          }
        ]
      };
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  configurarGraficoLinha(mesReferencia) {
    this.dashboardService.lancamentosPorDia(mesReferencia)
    .then(dados => {
      const diasDoMes = this.configurarDiasMes(mesReferencia);
      const totaisReceitas = this.totaisPorCadaDiaMes(
        dados.filter(dado => dado.tipo === 'RECEITA'), diasDoMes);
      const totaisDespesas = this.totaisPorCadaDiaMes(
        dados.filter(dado => dado.tipo === 'DESPESA'), diasDoMes);

      this.lineChartData = {
        labels: diasDoMes,
        datasets: [
          {
          label: 'Receitas',
          data: totaisReceitas,
          borderColor: '#3366CC'
          }, {
            label: 'Despesas',
              data: totaisDespesas,
              borderColor: '#D62B00'
          }
        ]
      };
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  // Monta um array com todos os dias do mês
  private configurarDiasMes(mesReferencia) {
    // const mesReferencia = new Date();
    // console.log('Mes referencia: ' + mesReferencia);
    mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    mesReferencia.setDate(0);

    const quantidade = mesReferencia.getDate();
    const dias: number[] = [];
    for (let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }
    return dias;
  }

  private totaisPorCadaDiaMes(dados, diasDoMes) {
    const totais: number[] = [];
    for (const dia of diasDoMes) {
      let total = 0;
      for (const dado of dados) {
        if (dado.dia.getDate() === dia) {
          total = dado.total;
          // console.log('Dia: ' + dia + '  total: ' + total);
          break;
        }
      }
      totais.push(total);
    }
    return totais;
  }

}
