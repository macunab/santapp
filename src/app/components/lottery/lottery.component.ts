import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Player {
  name: string;
  email: string;
}

interface Lottery {
  title: string;
  players: Array<Player>;
}

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css']
})
export class LotteryComponent implements OnInit {

  lotteryForm: FormGroup;

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

    if(this.lotteryForm.invalid) {
      console.log('the form is invalid');
      return;
    }

    const lottery: Lottery = this.lotteryForm.value;
    console.log(lottery);
  }

}
