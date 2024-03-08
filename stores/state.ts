import { defineStore } from 'pinia';
import { reactive, ref, nextTick } from 'vue';
import type { BasDados } from '../interfaces/basdados';

// Interface que define o estado da store
interface State {
  bas: BasDados[]; // Lista de BA's
  selectedId: string | null; // ID do BA selecionado para edição
  baNumber: number; // Número do BA
  baCentral: string; // Central do BA
  baStatus: string; // Status do BA
  baUF: string; // UF do BA
  name:string;

  month: string; // Mês atual
  update: boolean; // Flag para indicar se está em modo de atualização
  year: number; // Ano atual
  isInvalid: boolean; // Flag para indicar se há campos inválidos
  day: number; // Dia atual
  months: string[]; // Lista de meses
  dateObj: Date; // Objeto de data atual
  sortOrder: number; // Ordem de classificação da tabela
  timerRunning:boolean;
 

}
interface State {
  // Outros estados
  selectedPeriod: 'day' | 'week' | 'month' | 'total';
}




// Definição da store
export const useDadosStore = defineStore('dados', {
  // Estado inicial da store
  state: (): State => ({
    bas: reactive<BasDados[]>([]),
    selectedPeriod: 'total', // Período padrão
    sortOrder: 1,

    selectedId: null,
    baNumber: 0,
    baCentral: "",
    baStatus: "Aberto",
    baUF: "",
    name :"",
    month: "",
    update: false,
    day: 0,
    year: 0,
    isInvalid: false,
    dateObj: new Date(),
    months: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    timerRunning: false, // Novo estado para controlar se o timer está rodando
  }),

  // Ações disponíveis na store
  actions: {


    setSelectedPeriod(period: 'day' | 'week' | 'month' | 'total') {
      this.selectedPeriod = period;
      console.log("periodo" + this.selectedPeriod)
    },
    
    // Função auxiliar para filtrar os BAs pelo período desejado
    filterBasByPeriod(bas: BasDados[], period: 'day' | 'week' | 'month' | 'total'): BasDados[] {
      const today = new Date(); // Data atual

      return bas.filter((ba) => {
        let date = new Date(ba.date); // Data do BA
        switch (period) {
          case 'day':
            return date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
          case 'week':
            const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
            const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
            return date >= firstDayOfWeek && date <= lastDayOfWeek;
          case 'month':
            return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          default:
            return true; // Retorna true para 'total' para incluir todos os BAs
        }
      });
    },

      // Função para calcular a quantidade de BA por Usuario
     calculateItemsPerName(period: 'day' | 'week' | 'month' | 'total') {
      const filteredBAs = this.filterBasByPeriod(this.bas, period);
    
      const itemsPerName: Record<string, number> = {}; // Objeto para armazenar a contagem por nome
      filteredBAs.forEach((ba) => {
        const normalizedName = ba.name.trim().replace(/\s+/g, ' ').toLowerCase(); // Normaliza o nome removendo espaços extras
        if (!(normalizedName in itemsPerName)) {
          itemsPerName[normalizedName] = 0;
        }
        itemsPerName[normalizedName]++;
      });
    
      return { total: filteredBAs.length, perName: itemsPerName };
    },
    

         // Função para calcular a quantidade de itens por Central
         calculateItemsPerCentral(period: 'day' | 'week' | 'month' | 'total') {
          const filteredBAs = this.filterBasByPeriod(this.bas, period);
          const itemsPerCentral: Record<string, number> = {}; // Objeto para armazenar a contagem por central
          filteredBAs.forEach((ba) => {
            const central = ba.baCentral.toLowerCase(); // Converter para minúsculas
            // Verifica se a Central já existe no objeto, se não, cria com valor 0
            if (!itemsPerCentral[ba.baCentral]) {
              itemsPerCentral[ba.baCentral] = 0;
            }
            // Incrementa a contagem da Central atual
            itemsPerCentral[ba.baCentral]++;
          });
        
          return itemsPerCentral;
        },
        
     // Função para calcular a quantidade de itens por UF
     calculateItemsPerUF(period: 'day' | 'week' | 'month' | 'total') {
      const filteredBAs = this.filterBasByPeriod(this.bas, period);
      const itemsPerUF: Record<string, number> = {}; // Objeto para armazenar a contagem por UF

      // Percorre a lista de BAs
      filteredBAs.forEach((ba) => {
        const uf = ba.baUF.toUpperCase(); // Converta para maiúsculas
        // Verifica se a UF já existe no objeto, se não, cria com valor 0
        if (!itemsPerUF[ba.baUF]) {
          itemsPerUF[ba.baUF] = 0;
        }
        // Incrementa a contagem da UF atual
        itemsPerUF[ba.baUF]++;
      });

      return itemsPerUF;
    },
  
    // Busca os BA's da API
    async fetchBas() {
      try {
        // Faz a requisição para a API
        this.timerRunning = true; // Inicia o timer
        const response = await fetch('https://2qs083zp7j.execute-api.sa-east-1.amazonaws.com/prod/bas');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
     
        // Converte a resposta para JSON e atualiza a lista de BA's
        const data = await response.json();
        this.bas = data.map((ba: any) => ({
          baCentral: ba.baCentral,
          baStatus: ba.baStatus,
          baNumber: ba.baNumber,

          baUF: ba.baUF,
          date: ba.baDate,
          name:ba.name,
          id: ba.id,
 
        }));
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      } finally{
        
        this.timerRunning = false; // Para o timer
      }
  
    },

    // Seleciona um BA para edição
    editBa(selectedBa: BasDados) {
      this.selectedId = selectedBa.id ?? null;
      this.baCentral = selectedBa.baCentral;
      this.baNumber = selectedBa.baNumber;
      this.baStatus = selectedBa.baStatus;
      this.baUF = selectedBa.baUF;
      this.update = true;
      this.name = selectedBa.name;
    },

    // Atualiza um BA na API
    async updateBa(
      id: string | null,
      baCentral: string,
      baNumber:number,
      baStatus: string,
      baDate: string,
      baUF: string,
      name:string
    ) {
      const updateBa = {
        baCentral: baCentral,
        baStatus: baStatus,
        baNumber:baNumber,
        baDate: baDate,
        baUF: baUF,
        id: id,
        name:name
      };

      try {
        const response = await fetch(`https://2qs083zp7j.execute-api.sa-east-1.amazonaws.com/prod/bas/${id}`, {
          method: "PUT",
          
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBa),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        await this.fetchBas(); // Atualiza a lista de BA's
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    },

    // Adiciona um novo BA na API
    async next() {
      try {
        const dateObj = new Date();
        this.month = this.months[dateObj.getMonth()];
        this.day = dateObj.getDate();
        this.year = dateObj.getFullYear();

        const response = await fetch("https://2qs083zp7j.execute-api.sa-east-1.amazonaws.com/prod/bas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            baUF: this.baUF,
            baDate: `${this.month} ${this.day} ${this.year}`,
            baNumber: this.baNumber,
            baStatus: this.baStatus,
            baCentral: this.baCentral,
            name:this.name
          }),
          
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    },

    // Adiciona um novo BA na lista local e na API
    async addBas(
      baCentral: string,
      baStatus: string,
      baNumber: number,
      baUF: string,
      name: string,
   
    ) {
      if (  baCentral !== "" &&
      baStatus !== "" &&
      baUF  !== "" &&
      baCentral!== "" &&
       name!== "" &&
      baNumber.toString() !== "") {

        const { month, dateObj } = this;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
  
        // Função auxiliar para formatar os dados adicionais
        const novoBa: BasDados = {
          baCentral,
          baStatus,
          date: `${month}, ${day} ${year}`,
          baNumber,
          baUF,
          name,
        
    
        };
        this.isInvalid = false;
        console.log("erro"+ this.isInvalid)
        console.log(novoBa)
        this.bas.push(novoBa);
  
        try {
          await this.next(); // Aguarda a conclusão da requisição POST
          await nextTick(); // Aguarda a atualização da UI
          await this.fetchBas(); // Atualiza a lista de BA's
           // Exemplo de notificação
      const notification = new Notification('Novo BA Adicionado', {
        body: ` ${name}, ${baCentral}, ${baStatus}, ${baNumber}, ${baUF}`,
        requireInteraction: true,
      });

      // Define um tempo (em milissegundos) para a notificação desaparecer
      setTimeout(() => {
        notification.close();
      }, 5000); // Tempo em milissegundos (neste caso, 5 segundos)
        } catch (error) {
          console.error(error);
        }
      } else {
        this.isInvalid = true;
      }
       // Limpa os campos do formulário após a adição
  baUF = "";
  baCentral = "";
  baNumber = 0;
  baStatus = "Aberto";
  name = "";
    },



     // Função para deletar uma BA
// Função para deletar uma BA
deleteBa(id: string) {
  const confirmed = window.confirm("Tem certeza que deseja excluir este item?");
  if (confirmed) {
    fetch(
      `https://2qs083zp7j.execute-api.sa-east-1.amazonaws.com/prod/bas/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        this.fetchBas(); // Atualiza a lista de BA's
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }
},

  },
  },
);
