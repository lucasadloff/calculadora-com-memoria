import React, { Component } from 'react';
import './App.css';
import {Botao} from './componentes/Botao';
import {Input} from './componentes/Input';
import {BotaoApagar} from './componentes/BotaoApagar';
import {Display} from './componentes/Display';
import {DisplayMemoria} from './componentes/DisplayMemoria';
import {TextoMemoria} from './componentes/TextoMemoria';
import {EmptyBox} from './componentes/EmptyBox';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "", //variável do display superior, o qual será chamado de "display" no resto do arquivo.
      input: "0", //variável do display inferior, que também funciona como input, o qual será chamado de "input" no resto do arquivo.
      pilha_memoria: [], //pilha que armazenará os valores da funcionalidade de memória. 
      clear_cont: 0 //variaável utilizada para o botão de apagar -> 1 clique apaga apenas o display inferior e preserva a operação anterior.
    }                                                         // -> 2 cliques apagam ambos os displays.
  }

  addToInput = val => { //método utilizado para adicionar valores numéricos ao input.
    if (this.state.input === "Memória vazia"){ //condição para mensagem de erro exibida ao tentar recuperar valor da memória quando vazia.
      this.setState({input: val})
    }
    else if (this.state.input === "0"){ //condição para substituir o valor do input, se ele conter apenas 0.
      this.setState({input: val})
    }
    else if (this.state.display.includes("=")) { //caso o display contenha "=" (final de operação) e outro número for adicionado, altera o input e apaga o display.
      this.setState({display: "", input: this.state.input + val});
    }
    else { //para outros casos, o valor do imput passa a ser seu estado anterior + o valor numérico digitado.
      this.setState({input: this.state.input + val});
    }
  }

  addOperator = val => {      //método utilizado para tratar do pressionamento de botões de operação.
    var oper_disp = this.state.display;
    if (this.state.input === "Memória vazia"){ //condição para mensgem de erro exibida ao tentar recuperar valor da memória quando vazia.
      this.setState({input: "0"})
    }
    else if (oper_disp === "") {
      this.setState({display: this.state.input + val, input:"0"});
    } 
    else if (((oper_disp.includes("÷")) || (oper_disp.includes("×")) || (oper_disp.includes("-")) || (oper_disp.includes("+"))) && (!(oper_disp.includes('=')))) {
      if (this.state.input === "0"){  //condição para trocar a operação ao se pressionar outro botão de operação com input 0. Gera limitação discutida no relatório.
        if (oper_disp.includes("÷")){
          var operator = "÷";
        } 
        else if (oper_disp.includes("×")) {
          var operator = "×";
        } 
        else if (oper_disp.includes("+")) {
          var operator = "+";
        }
        else if ((oper_disp.charAt(0) !== "-") && (oper_disp.includes("-"))) { //apenas para primeiro termo positivo.
          var operator = "-";
        } 
        else if (oper_disp.charAt(0) === "-") {  //condição necessária para operações de subtração cujo primeiro número é negativo.
          var oper_disp = "-" + oper_disp.split("-")[1];
          var operator = "nosplit";
        }
        var ant_op = oper_disp.split(operator)[0];
        this.setState({display: ant_op + val});
      } 
      else { //ao apertar outro botão de operação em vez do botão "=" após uma operação, realiza a operação parcial e prossegue com a conta.
          var parcial_operation = this.state.display + this.state.input;
          var parcial_result = this.handleOperation(parcial_operation)[0];
          this.setState({display: parcial_result + val, input: "0"});
      }
    } //caso o display mostre uma operação finalizada por "=", copia o resultado para o primeiro termo na nova operação, sem perder o valor caso input === "0".
    else if (oper_disp.includes('=')){ 
      var new_oper = oper_disp.split('=')[0];
      var result = this.handleOperation(new_oper)[0];
      this.setState({display: result + val, input: "0"})
    } 
    else { //apesar de, em uso normal, essa condição nunca ser ativada (display diferente de "" e sem: "+", "-", "×", "÷"), fica como garantia para casos não previstos.
      this.setState({display: this.state.input + val, input: "0"})
    }
  }

  addDot = val => { //trata da inclusão do separador decimal esolhido, ".".
    if (this.state.input === "Memória vazia"){ //condição para mensgem de erro exibida ao tentar recuperar valor da memória quando vazia.
      this.setState({input: "0"})
    }
    else if (this.state.input.includes(".")){ //ao tentar adicionar "." sendo que já há "." no número, nada ocorre (número formatado com apenas um separador decimal).
      this.setState({input: this.state.input});
    } 
    else { //em outros casos, adiciona "." ao input.
      this.setState({input: this.state.input + val});
    }
  }

  handleOperation(val) { // Realiza as operações. Os resultados são formatados para o formato em inglês, com "." como separador decimal e "," a cada 3 dígitos inteiros.
    var val1 = val.replace(/,/g,""); //remove todas as possíveis "," das strings de operação.
    var ends_in_op = false; //valor usado para o método "operIgual", (não utilizado em funcionamento normal, fica como garantia para casos não previstos.).
    var val1_lenght = val1.length;
    if (val1.includes("÷") || val1.includes("×") || val1.includes("-") || val1.includes("+")) {
      if (val.charAt(0) === "-") { //trata do caso no qual o primeiro termo da operação é negativo.
        var new_val = val1.substr(1, val1_lenght - 1);
        if (new_val.includes("÷")){
          var oper = "÷"
        } 
        else if (new_val.includes("×")) {
          var oper = "×"
        } 
        else if (new_val.includes("-")) {
          var oper = "-"
        } 
        else if (new_val.includes("+")) {
          var oper = "+"
        } 
        else {
          var oper = "nosplit";
        }
        var firstOp_str = "-" + new_val.split(oper)[0];
        if (oper === "nosplit") {
          var secondOp_str = "";
        }
        else {
          var secondOp_str = new_val.split(oper)[1];
        }
      }
      else {
        var new_val = val1;
        if (new_val.includes("÷")){
          var oper = "÷"
        } 
        else if (new_val.includes("×")) {
          var oper = "×"
        } 
        else if (new_val.includes("-")) {
          var oper = "-"
        } 
        else if (new_val.includes("+")) {
          var oper = "+"
        } 
        var firstOp_str = new_val.split(oper)[0];
        var secondOp_str = new_val.split(oper)[1];
      }
      if (secondOp_str !== "") { //não utilizado em funcionamento normal, fica como garantia para casos não previstos.
        var firstOp = Number(firstOp_str);
        var secondOp = Number(secondOp_str);
        if (new_val.includes("÷")) {
          if (secondOp !== 0){
            var result_number = firstOp / secondOp;
          } 
          else {
            return ([NaN, ends_in_op])
          }
        } 
        else if (new_val.includes("×")) {
          var result_number = firstOp * secondOp;
        } 
        else if (new_val.includes("-")) {
          var result_number = firstOp - secondOp;
        } 
        else if (new_val.includes("+")) {
          var result_number = firstOp + secondOp;
        }
      } 
      else {
        var firstOp = Number(firstOp_str);
        var result_number = firstOp;
        var ends_in_op = true;
      }
      var result_str = result_number.toLocaleString('en', {maximumFractionDigits: 14}); //formata a resposta com 14 casas decimais e na formatação da língua inglesa.
      if (result_str === "-0"){
        var result_op_str = "0";
      }
      else {
        var result_op_str = result_str;
      }
      return ([result_op_str, ends_in_op])
    } 
    else {
      return ([val1, ends_in_op])
    }
  }

  operIgual() { //trata do pressionamento do botão de igual
      if (this.state.input === "Memória vazia"){ //condição para mensgem de erro exibida ao tentar recuperar valor da memória quando vazia.
        this.setState({input: "0"})
      }
      else if ((this.state.input === "0") && (this.state.display === "")) { //condição para economizar processamento ao pressionar "=", com input: "0" e display: "".
        this.setState({display: "0=", input: "0"})
      }
      else if (this.state.display.includes("=")){ //operação (ou número) no display é igual ao valor em  input -> pressionar igual -> mostra "input = input".
        this.setState({display: this.state.input + "="});
      } 
      else { //em casos gerais, realiza a operação e retorna o valor resultante.
        var operation_str = this.state.display + this.state.input;
        var [result_str, is_end_op] = this.handleOperation(operation_str);
        if (is_end_op) {
          this.setState({display: result_str + "=", input: result_str});
        } 
        else { //em funcionamento normal, isso não ocorre pois input nunca é === "", ficando como garantia para casos não previstos.).
          this.setState({display: operation_str + "=", input: result_str});
        }
      }
    }

  handleClear() { //Trata do botão de apagar conteúdo. Pressionar AC 1 vez -> apaga input. Pressionar AC uma segunda vez, com input === "0", também apaga display.
    if ((this.state.input === "0") && (this.state.clear_cont === 1)) {
      this.setState({input: "0", clear_cont: 0, display: ""});
    }
    else {
      this.setState({input: "0", clear_cont: 1});
    }
  }

  handleMemory = val => { //Trata dos botões das funções de memória presentes acima do botão AC.
    var val2 = val;
    if (val2 === "MC") {  //Caso o botão pressionado seja "MC", a pilha de memória se torna vazia (todos os valores apagados).
      this.setState({pilha_memoria: []});
    }
    else if (val2 === "MR") { //Caso o botão pressionado seja "MR", tenta recuperar o valor do topo da pilha (fim da lista).
      if (!(this.state.pilha_memoria.length > 0)){ //Caso a pilha esteja vazia, retorna uma mensagem avisando que a memória está vazia.
        this.setState({input: "Memória vazia"});
      }
      else { //Caso contrário, recupera o valor do topo da pilha.
        var input_string = this.state.pilha_memoria[this.state.pilha_memoria.length -1].toString()
        this.setState({input: input_string});
      }
      
    }
    else if (val2 === "M+") { //Caso o botão pressionado seja "M+", tenta somar o valor atual do input ao valor do topo da pilha.
      if (!(this.state.pilha_memoria.length > 0)){ //Caso a pilha esteja vazia, redireciona a operação para a função "MS"
        var val2 = "MS"; 
      }
      else{ //Caso contrário, soma o valor atual do input ao valor do topo da pilha.
        let new_list = this.state.pilha_memoria;
        var a = this.state.pilha_memoria.length - 1;
        var input_sem_virgulas = this.state.input.replace(/,/g,"");
        var b = new_list[a] + Number(input_sem_virgulas);
        new_list.splice(a, 1, b);
        this.setState({pilha_memoria: new_list});
      }
      
    }
    if (val2 === "MS") { //Caso o botão pressionado seja "MS", adiciona o valor de input ao topo da pilha.
      if (this.state.input !== "Memória vazia"){ //Caso o valor de input NÃO seja a mensagem "Memória vazia", adiciona o valor de input ao topo da pilha.
        var new_str = this.state.input.replace(/,/g,"");
        var c = this.state.pilha_memoria.length;
        var new_num = Number(new_str);
        var new_pilha = this.state.pilha_memoria;
        new_pilha.splice(c, 0, new_num);
        this.setState({pilha_memoria: new_pilha});
      }
      else { //Caso contrário, nada ocorre.
        this.setState({input: "Memória vazia"});
      }
    }
  }

  handeleMemory2 = (val, i) => { //Trata dos botões das funções de memória dos valores no registro. 
    //A pilha aceita qualquer número de valores, mas apenas os 7 do topo serão exibidos.
    if (this.state.pilha_memoria[this.state.pilha_memoria.length -i] === undefined) { 
      this.setState({input: "Memória vazia"}); //caso não haja um valor na posição cujo botão foi acionado, retorna a mensagem de "memória vazia".
    } //Caso contrário:
    else if (val === "MC") { //Se o botão pressionado for "MC", apaga o registro na posição correspondente.
      var d = this.state.pilha_memoria.length - i;
      var pilha = this.state.pilha_memoria;
      pilha.splice(d,1);
      this.setState({pilha_memoria: pilha});
    }
    else if (val === "MR") { //Se o botão pressionado for "MR", recupera o registro da posição correspondente.
      var input_string = this.state.pilha_memoria[this.state.pilha_memoria.length -i].toString()
      this.setState({input: input_string});
    }
  }

  render(){ //monta layout da calculadora
  return (
    <div className="App">
      <div className="calc-wrapper">
        <Display input={this.state.display}/>
        <Input input={this.state.input}/>
        <div className="row">
        <Botao handleClick={this.handleMemory}>MC</Botao>
        <Botao handleClick={this.handleMemory}>MR</Botao>
        <Botao handleClick={this.handleMemory}>M+</Botao>
        <Botao handleClick={this.handleMemory}>MS</Botao>
        </div>
        <div className="row">
          <BotaoApagar handleClick={() => this.handleClear()}>AC</BotaoApagar>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>8</Botao>
          <Botao handleClick={this.addToInput}>7</Botao>
          <Botao handleClick={this.addToInput}>9</Botao>
          <Botao handleClick={this.addOperator}>÷</Botao>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>4</Botao>
          <Botao handleClick={this.addToInput}>5</Botao>
          <Botao handleClick={this.addToInput}>6</Botao>
          <Botao handleClick={this.addOperator}>×</Botao>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>1</Botao>
          <Botao handleClick={this.addToInput}>2</Botao>
          <Botao handleClick={this.addToInput}>3</Botao>
          <Botao handleClick={this.addOperator}>-</Botao>
        </div>
        <div className="row">
          <Botao handleClick={this.addToInput}>0</Botao>
          <Botao handleClick={this.addDot}>.</Botao>
          <Botao handleClick={() => this.operIgual()}>=</Botao>
          <Botao handleClick={this.addOperator}>+</Botao>
        </div>
      </div>
      <EmptyBox/>
      <div className="memoria">
        <DisplayMemoria input={"Memória"}/>
        <div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -1]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 1)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 1)}>MR</Botao>
        </div>
        <div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -2]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 2)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 2)}>MR</Botao>
        </div><div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -3]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 3)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 3)}>MR</Botao>
        </div><div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -4]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 4)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 4)}>MR</Botao>
        </div><div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -5]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 5)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 5)}>MR</Botao>
        </div><div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -6]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 6)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 6)}>MR</Botao>
        </div><div className="row">
          <TextoMemoria input={this.state.pilha_memoria[this.state.pilha_memoria.length -7]}/>
          <Botao handleClick={() => this.handeleMemory2("MC", 7)}>MC</Botao>
          <Botao handleClick={() => this.handeleMemory2("MR", 7)}>MR</Botao>
        </div>
      </div>
    </div>
  );
  }
}

export default App;
