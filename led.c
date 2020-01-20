/**Timer Example/
/*the program "main" is going to schedules 3 tasks but
they are just written as a functions of timer zero so
timer0ISR is going to decrement three counters
timer 0 is going to build three virtual timers, 3 1ms timers

task1:  blink an LED 2/8 Hz dependiendo depending of a buttonpush
task2: blink LED at 1 Hz
task3: look for buttonpush and signal task1
*/

#include <inttypes.h> //usseful if you want to use cpu independent types names like instead char use u_int8
#include <avr/io.h> //logical names of every pin name(OCR0A, OCIE0A)
#include <avr/interrupt.h>//just two macros to esay setup ISR
#include <stdio.h> //funtction for serial interfaces, getchar putchar
//#include <"uart.h"> //uart has more information about bautrates and how fast
//you want to send stuff across the serial link

//i like to define
#define begin {
#define end }

//t1, t2, t3 >> 1 byte, maxim 255, value in miliseconds
#define t1 250
#define t2 125
#define t3 60


volatile unsigned char time1,time2, time3; //this variables need to be shared 
										   //in main and in the interrump, need to be globals
unsigned char tsk2c, tsk3m, led;
			//tsk2c = counter
			//tsk3m = is going to signal task1 that task3 has seen a button push
			//led = hold state of leds
unsigned int time; //hold a value of miliseconds since last reset
				   //is going to running cpu time
				   
// UART file descriptor
// putchar and getchar are in uart.c
//FILE uart_str = FDEV_SETUP_STREAM(uart_putchar, uart_getchar, _FDEV_SETUP_RW);

/*Interrupt Service Routine
which flag this function*/
ISR(TIMER0_COMPA_vect)
begin
	if(time1 > 0)  --time1;//if time1 mayor que 0 decremento time1
	if(time2 > 0)  --time2;
	if(time3 > 0)  --time3;
end


//funciones
void initialize(void)
begin
	//correction: if you do not declare a register in DDRx by default it is an input
	DDRD = 0xff;//going to use PORTD.0, PORTD.1 and PORTD.2 as outputs: 2 for led1 and led2 
			//and one for a led indicator(power ON indicator)
				//all the other pins act as inputs
	PORTD = 0xff; //power off 3 leds, WHY??????? 
	//DDRD = 0x02; //bit 2 de portD como salida, porque ese pin es el de Tx
				 // otra manera de escribir DDRD = (1<<PORTD1)
	
	/*4 pasos para inicializar el timer*/
	TIMSK0=(1<<OCIE0A);//necesitamos setear el "Output Compare Interrupt Enable timer0 channel A"
	OCR0A = 249;//compare register, recordemos que es un sistema basado en 0,
				//y queremos 77 conteos para hacer un milisegundo
	TCCR0A=(1<<WGM01);//activa Clear on Compare Match function
	TCCR0B=3;//0b00000100
			 //activo el prescaler dividido para 64
	
	//inicialiozamos las variables
	led = 0xff;
	time1=t1;
	time2=t2;
	time3=t3;
	tsk2c=4;//task 2 count
	tsk3m=0;//task 3 messsage
	
   // init the UART to send the information to the terminal
   //-- uart_init() is in uart.c
	/*
	uart_init();
	stdout = stdin = stderr = &uart_str;
	fprintf(stdout,"\n\rIniciando...\n\r");
	*/
	
	sei();//set interrupt enable, if you do not put this line the timer will be do "NOTHING!!!!"
	
end  //end initialize

void task1(void)
begin
	if (tsk3m != 0) time1>>=2;//time1 shift by 2 bits(divide by 4) and we go from 2Hz to 8Hz
	led = led^0x02;//bit 1
	PORTD=led;
	
	// and print the current time
	// fprintf(stdout,"%d \n\r",time++);//time++ muestra luego incrementa
									 //++time incrementa luego muestra
end

void task2(void)
begin
	if (--tsk2c == 0)
	begin
		tsk2c=4;
		led=led^0x04;//bit 2
		PORTD=led;
	end
end

void task3(void)
begin
	tsk3m=~PIND & 0x40; //wait for push on PORTDB.6, push on ground, detecting only PB6
end


/*main despues de la declaracion de funciones para evitar
warnings "conflicting types for..." */

//programa principal
int main(void)
begin
	initialize();//alot of stuffs of low level(hardware setting)
				 //that configure i/o ports, timers, and others
	
	while(1) begin 
		if (time1==0){time1=t1;task1();}
		if (0==time2){time2=t2;task2();}
		if (0==time3){time3=t3;task3();}
		end
end
/*thats all folks!!...YOUR WORK IS CONFIGURE THE LEDS AND PUSH BUTTONS IN DIFERENTS I/O PIN PORTS
IF NOT YOU GET AN AMAZING AND APPRECIATIVE "ZERO" */