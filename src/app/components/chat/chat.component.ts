import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {

  public fb: FormBuilder = inject(FormBuilder)
  private chatService : ChatService = inject(ChatService);
  private route : ActivatedRoute = inject(ActivatedRoute);

  // messageInput = signal<String>('');
  // userId = signal<String>('');
  public messageList = signal<any>([]);

  public myForm : FormGroup = this.fb.group({
    messageInput: [''],
    userId: [''],
  })


  ngOnInit(): void {
    this.myForm.get('userId')?.setValue(this.route.snapshot.params["userId"])
    this.chatService.initConnectionSocket();
    this.chatService.joinRoom("ABC");
    this.lisenerMessage();
  }

  sendMessage(){
    const chatMessage = {
      message: this.myForm.get('messageInput')?.value,
      user: this.myForm.get('userId')?.value
    } as ChatMessage;
    this.chatService.sendMessage("ABC", chatMessage);
    this.myForm.get('messageInput')?.setValue('');
  }

  lisenerMessage(){
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      console.log(messages)
      this.messageList.set(messages.map((item : any) => {
        return {
          ...item,
          message_side: item.user === this.myForm.get('userId')?.value ? 'sender' : 'receiver'
        }
      }))
    })
  }



}
