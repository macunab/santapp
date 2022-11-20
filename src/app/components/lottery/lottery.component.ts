import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import './../../../assets/js/smtp.js'
declare let Email: any;

interface Player {
  name: string;
  email: string;
}

interface Lottery {
  title: string;
  players: Array<Player>;
}

interface LotteryResult {
  santa: Player;
  name: string;
}

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css']
})
export class LotteryComponent implements OnInit {

  lotteryForm: FormGroup;
  loading: boolean = false;

  constructor(private fb:FormBuilder) { 
    this.lotteryForm = this.fb.group({
      title: ['', [Validators.required]],
      players: this.fb.array([this.createPlayers()])
    });
  }

  ngOnInit(): void {
  }

  createPlayers(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get players(): FormArray {
    return <FormArray>this.lotteryForm.get('players');
  }

  addPlayer(): void {
    this.players.push(this.createPlayers());
  }

  onDeletePlayer(itemIndex: number): void {
    console.log(itemIndex);
    this.players.removeAt(itemIndex);
  }

  onSave() {
    
    if(this.lotteryForm.invalid || this.players.length < 2) {
      console.log('the form is invalid');
      if(this.players.length < 2){
        Swal.fire({
          title: 'Please add at least 2 players',
          icon: 'error'
        })
      }
      return;
    }

    const lottery: Lottery = this.lotteryForm.value;
    console.log(lottery.players);
    this.sendEmails(lottery);
    this.lotteryForm.reset();
    this.players.clear();
    this.addPlayer();
  }

  /* recorro la lista de players, tengo una copia de la lista a la que voy a sacar 
    cada player que asigne como objetivo y guardare cada player en una tercera lista que voy a recorrer enviando
    el mail con el nombre del player que le toco para regalo...
    1) lista de player.
    2) copia de lista de player que voy a ir desapilando players a medida que salgan seleccionados de forma random.
    3) Lista para recorrer y enviar mail compuesta de objetos { player, name } o { player, player }
  */
  sendEmails(lottery: Lottery): void {
    let playersTemp: Array<Player> = lottery.players;
    let secretResult: Array<LotteryResult> = [];
    let index: number;
    console.log(playersTemp);
    for(var player of lottery.players) {
      const valueArr = lottery.players.map( item => item.email);
      let isDuplicate = valueArr.some((item, index) => {
        return valueArr.indexOf(item) != index;
      })
      if(isDuplicate) {
        Swal.fire({
          title: 'No puede ingresar el mismo email para diferentes participantes',
          icon: 'warning'
        })
        return;
      }
      do {
        index = Math.floor(Math.random() * (playersTemp.length));
        console.log(`El index generado es: ${ index }`)
      } while (playersTemp[index].email === player.email);
      const santa: LotteryResult = { santa: player, name: playersTemp[index].name }
      secretResult.push(santa);
      
    }
    Email.send({
      SecureToken: "7e8b1e24-50a7-417e-a2d5-bcf702f6a164",
      To: 'mn.acunab@gmail.com',
      From: 'sorteoloco@gmail.com',
      Subject: 'Sorteo de SecretSanta',
      Body: 'SE ENVIO EL SORTEO',
    }).then(
      console.log('SE ENVIO')
      )
  }

}
