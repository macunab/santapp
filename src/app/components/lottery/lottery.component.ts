import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lottery } from 'src/app/interfaces/interfaces';
import Swal from 'sweetalert2';
import { LotteryService } from '../../services/lottery.service';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css']
})
export class LotteryComponent implements OnInit {

  lotteryForm: FormGroup;
  loading: boolean = false;

  constructor(private fb:FormBuilder, private lotteryService: LotteryService) { 
    this.lotteryForm = this.fb.group({
      title: ['', [Validators.required]],
      participants: this.fb.array([this.createParticipants()])
    });
  }

  ngOnInit(): void {
  }

  createParticipants(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get participants(): FormArray {
    return <FormArray>this.lotteryForm.get('participants');
  }

  addPlayer(): void {
    this.participants.push(this.createParticipants());
  }

  onDeletePlayer(itemIndex: number): void {
    console.log(itemIndex);
    this.participants.removeAt(itemIndex);
  }

  onSave() {
    
    if(this.lotteryForm.invalid || this.participants.length < 2) {
      console.log('the form is invalid');
      if(this.participants.length < 2){
        Swal.fire({
          title: 'Ingrese por lo menos 2 participantes',
          icon: 'error'
        })
      }
      return;
    }
    const lottery: Lottery = this.lotteryForm.value;
    this.sendEmails(lottery);
  }

  sendEmails(lottery: Lottery): void {
    const valueArr = lottery.participants.map( item => item.email);
    let hasDuplicates = valueArr.some((item, index) => {
      return valueArr.indexOf(item) != index;
    })
    if(hasDuplicates) {
      Swal.fire({
        title: 'Asegurese que los participantes cuenten con emails diferentes.',
        icon: 'warning'
      })
      return;
    }
    try {
      this.lotteryService.makeLottery(lottery)
        .subscribe( res => {
          if(res) {
            this.lotteryForm.reset();
            this.participants.clear();
            this.addPlayer();
            Swal.fire({
              title: 'El sorteo se ha realizado con exito',
              icon: 'success'
            });
          }
        });
    } catch(error) {
      Swal.fire({
        title: 'Ha ocurrido un error al intentar enviar los resultados del sorteo.',
        icon: 'warning'
      })
    }
    /*const playersTemp: Array<Player> = [ ...lottery.players];
    let secretResult: Array<LotteryResult> = [];
    let index: number;
    for(var player of lottery.players) {
      const valueArr = lottery.players.map( item => item.email);
      let hasDuplicates = valueArr.some((item, index) => {
        return valueArr.indexOf(item) != index;
      })
      if(hasDuplicates) {
        Swal.fire({
          title: 'Asegurese que los participantes cuenten con emails diferentes.',
          icon: 'warning'
        })
        return;
      }
      do {
        index = Math.floor(Math.random() * (playersTemp.length));
      } while (playersTemp[index].email === player.email);
      const santa: LotteryResult = { santa: player, name: playersTemp[index].name }
      secretResult.push(santa);
      Email.send({
        SecureToken: "7e8b1e24-50a7-417e-a2d5-bcf702f6a164",
        To: santa.santa.email,
        From: 'sorteoloco@gmail.com',
        Subject: 'Sorteo de SecretSanta',
        Body: `Tu Secret Santa es : ${ santa.name }`,
      }).then(
        console.log('SE ENVIO TEMP probar con https githubpages')
        )
        playersTemp.splice(index, 1);
    }*/
  }
}
