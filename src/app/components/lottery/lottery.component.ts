import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css']
})
export class LotteryComponent implements OnInit {

  lotteryForm: FormGroup;

  constructor(private fb:FormBuilder) { 
    this.lotteryForm = this.fb.group({
      title: [],
      players: this.fb.array([this.createPlayers()])
    });
  }

  ngOnInit(): void {
  }

  createPlayers(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]]
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

}
