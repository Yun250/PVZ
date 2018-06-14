
let play=true

let fondoImg
let marcadoresImg
let solImg
let soles=50
let txtInformativo
let cartaArrastrarImg
let button

const zombies=[]
const animacionZombieComun=[]
const animacionZombieCono=[]
const animacionZombieCubeta=[]
const animacionZombieGrandote=[]
const plantas=[]
const cartasImg=[]
const podadoras=[]

let zombiesMatados=0
let cantidadZombiesMatar=15
let progreso=0

let presione=0
let plantaSeleccionada=false
let cartaSeleccionada

let noCartas=7
let noZombies=4

let nivel=1

let gameComplete
let gameOver

const sonidos=[]

function setup() {

	createCanvas(1365, 650)
}

function draw()
{
	if(play && document.getElementById("jugar").value==1)
		pintarFondo()
	else
		pintarTablero(true)

	playSonidos()
}

function pintarFondo()
{
	definirNivel()
	pintarTablero()
	pintarCartas()
	pintarPodadoras()
	pintarPlantas()
	pintarZombies()
	pintarSolAleatorio()
	arrastrarCarta()
	activarZombieParaDisparar()
	disparoDePlantas()
	comerPlantas()
	pintarTextoInformativo()
}

function preload()
{
	fondoImg=loadImage("img/Otras/fondo.jpg")

	marcadoresImg={
		marcador1: loadImage("img/Otras/marcadores.png"),
		marcador2: loadImage("img/Otras/marcadores2.png"),
	}

	for(let s=0; s<7; s++)
	{
		let sonido={
			audio: loadSound(`sounds/${s}.mp3`),
			sonar: true,
			volumen: 1,
		}
		sonidos.push(sonido)
	}

	txtInformativo={
		texto: "Necesitas mas soles",
		posX: mouseX,
		posY: mouseY,
		tiempoRecarga: 100,
		tiempoRecargaAux: 100,
		activada: false,
	}
	
	definirNivel()
	cargarSol()
	cargarPlanta()
	button=loadImage("img/Otras/button.png")

	for(let x=0; x<noCartas; x++)
	{
		cargarCarta(x)
	}

	for(let x=0; x<noZombies; x++)
	{
		cargarZombie()
	}

	for(let x=0; x<16; x++)
	{
		animacionZombieComun[x]=loadImage(`img/Zombies/Zombie Simple/${x}.png`);
	}

	for(let x=0; x<51; x++)
	{
		animacionZombieCono[x]=loadImage(`img/Zombies/Zombie con Cono/${x}.png`);
	}

	for(let x=0; x<31; x++)
	{
		animacionZombieCubeta[x]=loadImage(`img/Zombies/Zombie Cubeta/${x}.png`);
	}

	for(let x=0; x<38; x++)
	{
		animacionZombieGrandote[x]=loadImage(`img/Zombies/Zombie Grandote/${x}.png`);
	}

	for(let x=0; x<5; x++)
	{
		cargarPodadoras(x)
	}

	gameComplete={
		img: loadImage("img/Otras/gameComplete.png"),
		activo: false,
	}
	gameOver={
		img: loadImage("img/Otras/gameOver.png"),
		activo: false,
	}
}

function playSonidos()
{
	if(gameOver.activo || gameComplete.activo)
		sonidos[1].audio.stop()

	if(play && document.getElementById("jugar").value==1 && !gameOver.activo && !gameComplete.activo)
	{
		if(!sonidos[1].audio.isPlaying())
			sonidos[1].sonar=true

		if(sonidos[1].sonar)
		{
			sonidos[0].audio.stop()
			sonidos[1].audio.play()
			sonidos[1].sonar=false
		}
	}
	else
	{		
		if(play && document.getElementById("jugar").value!=1 && !gameOver.activo && !gameComplete.activo)
		{
			if(!sonidos[0].audio.isPlaying())
				sonidos[0].sonar=true

			if(sonidos[0].sonar)
			{
				sonidos[1].audio.stop()
				sonidos[0].audio.play()
				sonidos[0].sonar=false
			}
		}
	}
}

function definirNivel()
{
	switch(document.getElementById("nivelJugar").value)
	{
		case '1':
			cantidadZombiesMatar=15
			nivel=1
		break

		case '2':
			cantidadZombiesMatar=25
			nivel=2
		break

		case '3':
			cantidadZombiesMatar=35
			nivel=3
		break
	}
}

function pintarTablero(tinte)
{
	if(tinte)
		tint(0, 153, 204, 126)
	else
		noTint()

	image(fondoImg, 0, 0, windowWidth, windowHeight)
	
	image(marcadoresImg.marcador1, 200, 0)
	image(marcadoresImg.marcador2, 604, 1)

	fill("BLACK")
	textSize(18)
	text(soles, 225, 83)

	fill("WHITE")
	rect(965,615,130,25, 7)

	fill("LIGHTGREEN")
	rect(965,615,Math.floor(progreso*.99+progreso*.31),25, 7)

	fill("BLACK")
	textSize(16)
	text("Progreso "+progreso+"%", 978, 634)
	
	image(button,645,620, 65,30)
	text("Nivel "+nivel, 653, 641)

	noTint()
	image(button,900,10, 65,25)
	text("Pause", 910, 29)

	if(gameOver.activo)
	{
		if(!sonidos[6].audio.isPlaying() && sonidos[6].sonar)
		{
			sonidos[6].audio.play()
			sonidos[6].sonar=false
		}

		image(gameOver.img,0,0, 1365,650)
	}
	else
		if(gameComplete.activo)
			image(gameComplete.img,0,0, 1365,650)

	//line(1000,0, 1000,650)
}

function pintarCartas()
{
	for(let x=0; x<cartasImg.length; x++)
	{
		image(cartasImg[x].img, cartasImg[x].posX, cartasImg[x].posY, cartasImg[x].tamX, cartasImg[x].tamY)
	}
}

function pintarPodadoras()
{
	for(let x=0; x<podadoras.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			if(!podadoras[x].utilizado)
				image(podadoras[x].img, podadoras[x].posX, podadoras[x].posY, podadoras[x].tamX, podadoras[x].tamY)		

			if(zombies[y].posX<=200 && zombies[y].zombieActivado && !podadoras[x].utilizado)
			{
				let p=0

				while(p<podadoras.length && podadoras[p].posLineaPodadora!=zombies[y].posLineaZombie)
				{
					p++
				}

				podadoras[p].activar=true
			}

			if(podadoras[x].posLineaPodadora==zombies[y].posLineaZombie && podadoras[x].activar && !podadoras[x].utilizado)
			{
				if(podadoras[x].posX>=zombies[y].posX && zombies[y].zombieActivado)
				{
					let zombiesActivosActuales=0

					for(let j=0; j<zombies.length; j++)
					{
						if(zombies[j].zombieActivado)
							zombiesActivosActuales++
					}

					if(zombiesMatados+zombiesActivosActuales<cantidadZombiesMatar)
						zombies[y]=inicializarZombie()
					else
						zombies[y].zombieActivado=false				

					progreso=Math.floor(++zombiesMatados*100/cantidadZombiesMatar)

					if(progreso>=100)
					{
						gameComplete.activo=true
						play=false
					}
				}
			}
			if(podadoras[x].activar && podadoras[x].posX<=1000 && !podadoras[x].utilizado)
				podadoras[x].posX+=podadoras[x].velocidad
			
			if(podadoras[x].posX>1000)
				podadoras[x].utilizado=true
		}
	}
}

function pintarPlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		if(plantas[x].plantaActivada)
		{
			image(plantas[x].img, plantas[x].posX, plantas[x].posY, plantas[x].tamX, plantas[x].tamY)

			//Este tipo de plantas son los girasoles
			if(plantas[x].tipoPlanta==0)
			{
				plantas[x].tiempoRecargaSol--
				
				if(plantas[x].tiempoRecargaSol<=0)
				{
					plantas[x].mostrarSol=true
					image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
				}

				if(plantas[x].mostrarSol)
				{
					plantas[x].tiempoMostrarSol--
					
					if(plantas[x].tiempoMostrarSol<=0)
					{
						plantas[x].mostrarSol=false
						plantas[x].tiempoRecargaSol=plantas[x].tiempoRecargaSolAux
						plantas[x].tiempoMostrarSol=plantas[x].tiempoMostrarSolAux
					}
				}
			}
		}
	}

	for(let x=0; x<plantas.length; x++)
	{
		if(plantas[x].plantaActivada)
		{
			//Plantar el chile
			if(plantas[x].tipoPlanta==6)
			{
				plantas[x].tiempoRecargaChile--

				if(plantas[x].tiempoRecargaChile<=0)
				{
					if(!sonidos[3].audio.isPlaying())
						sonidos[3].audio.play()

					plantas[x].mostrarChile=true
					image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
				}

				if(plantas[x].mostrarChile)
				{
					for(let y=0; y<zombies.length; y++)
					{
						if(plantas[x].posLineaPlanta==zombies[y].posLineaZombie && !plantas[x].plantaUsada && zombies[y].listoParaDisparar && zombies[y].zombieActivado)
						{
							zombies[y].vida-=plantas[x].danio

							if(zombies[y].vida<=0)
							{
								let zombiesActivos=0

								for(let j=0; j<zombies.length; j++)
								{
									if(zombies[j].zombieActivado)
										zombiesActivos++
								}

								if(zombiesMatados+zombiesActivos<cantidadZombiesMatar)
									zombies[y]=inicializarZombie()
								else
									zombies[y].zombieActivado=false

								progreso=Math.floor(++zombiesMatados*100/cantidadZombiesMatar)

								if(progreso>=100)
								{
									gameComplete.activo=true
									play=false
								}
							}
						}
					}
					plantas[x].plantaUsada=true

					plantas[x].tiempoMostrarChile--
					
					if(plantas[x].tiempoMostrarChile<=0)
					{
						plantas[x].mostrarChile=false
						plantas[x].plantaActivada=false
					}
				}
			}
		}
	}
}

function pintarZombies()
{
	for(let x=0; x<zombies.length; x++)
	{
		if(zombies[x].zombieActivado)
		{
			if(zombies[x].posSprites<zombies[x].sprites)
				zombies[x].posSprites++
			else
				zombies[x].posSprites=0

			switch(zombies[x].tipoZombie)
			{
				case 0:
					image(animacionZombieComun[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 1:
					image(animacionZombieCono[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 2:
					image(animacionZombieCubeta[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 3:
					image(animacionZombieGrandote[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break
			}
		}

		if(zombies[x].posX<=190 && zombies[x].zombieActivado)
		{
			for(let y=0; y<podadoras.length; y++)
			{
				if(podadoras[y].posLineaPodadora==zombies[x].posLineaZombie && podadoras[y].utilizado)
				{
					gameOver.activo=true
					play=false
				}
			}
		}

		if(zombies[x].posX<=1350 && sonidos[5].sonar)
		{
			sonidos[5].audio.play()
			sonidos[5].sonar=false
		}

		zombies[x].posX-=zombies[x].velocidadMovimiento
	}
}

function pintarSolAleatorio()
{
	image(solImg.img, solImg.posX, solImg.posY, solImg.tamX, solImg.tamY)

	if(solImg.posY<solImg.limite)
		solImg.posY+=solImg.velocidad

	if(solImg.posY>=solImg.limite)
	{
		solImg.tiempoMostrarSol--
		
		if(solImg.tiempoMostrarSol<=0)
			cargarSol()
	}
}

function arrastrarCarta()
{
	if(cartaArrastrarImg.activada)
	{
		image(cartaArrastrarImg.img, cartaArrastrarImg.posX, cartaArrastrarImg.posY, cartaArrastrarImg.tamX, cartaArrastrarImg.tamY)
		cartaArrastrarImg.posX=mouseX-cartaArrastrarImg.tamX/2
		cartaArrastrarImg.posY=mouseY-cartaArrastrarImg.tamY/2
	}
}

function activarZombieParaDisparar()
{
	for(let y=0; y<zombies.length; y++)
	{
		//Reestablecer daños no vistos
		if(zombies[y].posX<=1000 && zombies[y].zombieActivado)
		{
			if(!zombies[y].listoParaDisparar)
				zombies[y].vida=zombies[y].auxVida

			//Activar todas las plantas de la linea
			for(let z=0; z<plantas.length; z++)
			{
				if(plantas[z].posLineaPlanta==zombies[y].posLineaZombie && plantas[z].tipoPlanta!=0 && plantas[z].plantaActivada)
				{
					if(!plantas[z].listoParaDisparar)
						plantas[z].posXBala=plantas[z].posXBalaAux

					plantas[z].listoParaDisparar=true
				}
			}
			zombies[y].listoParaDisparar=true
		}
	}
}

function disparoDePlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			//Disparar bala
			if(plantas[x].tipoPlanta!=0 && plantas[x].tipoPlanta!=6 && plantas[x].posLineaPlanta==zombies[y].posLineaZombie && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux && zombies[y].posX>=plantas[x].posX && plantas[x].listoParaDisparar && zombies[y].listoParaDisparar && plantas[x].plantaActivada && zombies[y].zombieActivado)
				image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)

			if(plantas[x].listoParaDisparar && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux)
				plantas[x].posXBala+=plantas[x].velocidadBala

			//Validar disparo a zombie
			if(plantas[x].tipoPlanta!=0 && plantas[x].tipoPlanta!=6 && plantas[x].posLineaPlanta==zombies[y].posLineaZombie && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux && zombies[y].posX>=plantas[x].posX && plantas[x].posXBala-25>=zombies[y].posX && zombies[y].listoParaDisparar && plantas[x].listoParaDisparar && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{
				plantas[x].posXBala=plantas[x].posXBalaAux
				plantas[x].tiempoRecarga=0
				plantas[x].tiempoRecargaAux+=8
				zombies[y].vida-=plantas[x].danio

				if(plantas[x].plantaHielo && !zombies[y].congelado)
				{
					zombies[y].velocidadMovimiento-=0.1
					zombies[y].congelado=true
				}

				if(zombies[y].vida<=0 && zombies[y].listoParaDisparar) 
				{
					plantas[x].listoParaDisparar=false
					plantas[x].tiempoRecargaAux=plantas[x].tiempoRecargaOriginal

					let zombiesActivos=0

					for(let j=0; j<zombies.length; j++)
					{
						if(zombies[j].zombieActivado)
							zombiesActivos++
					}

					if(zombiesMatados+zombiesActivos<cantidadZombiesMatar)
						zombies[y]=inicializarZombie()
					else
						zombies[y].zombieActivado=false

					progreso=Math.floor(++zombiesMatados*100/cantidadZombiesMatar)

					if(progreso>=100)
					{
						gameComplete.activo=true
						play=false
					}
				}
			}

			if(plantas[x].tiempoRecarga<plantas[x].tiempoRecargaAux)
				plantas[x].tiempoRecarga++
		}
	}
}

function comerPlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			//Comer plantas
			if(zombies[y].posLineaZombie==plantas[x].posLineaPlanta && zombies[y].posX-50<=plantas[x].posX && zombies[y].posX+50>=plantas[x].posX && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{
				if(!sonidos[4].audio.isPlaying())
					sonidos[4].audio.play()

				zombies[y].velocidadMovimiento=0
				plantas[x].vida-=zombies[y].danio

				if(plantas[x].vida<=0 && plantas[x].plantaActivada)
				{			
					//Volver a permitir que caminen todos los zombies
					for(let z=0; z<zombies.length; z++)
					{
						if(zombies[z].posLineaZombie==plantas[x].posLineaPlanta)
							zombies[z].velocidadMovimiento=zombies[z].velocidadMovimientoAux
					}
					plantas[x].plantaActivada=false
				}
			}
		}
	}
}

function pintarTextoInformativo()
{
	if(txtInformativo.activada)
	{
		image(button, txtInformativo.posX-12,txtInformativo.posY-25, 170,40)
		fill("BLACK")
		text(txtInformativo.texto, txtInformativo.posX, txtInformativo.posY)

		if(txtInformativo.tiempoRecarga<=0)
		{
			txtInformativo.tiempoRecarga=txtInformativo.tiempoRecargaAux			
			txtInformativo.activada=false
		}
		
		txtInformativo.tiempoRecarga--
	}
	txtInformativo.posX=mouseX-70
	txtInformativo.posY=mouseY-10
}

function cargarPlanta()
{
	let cartaArrastrar={
		img: "",
		posX: mouseX-70/2,
		posY: mouseY-70/2,
		tamX: 70,
		tamY: 70,
		activada: false,
	}

	cartaArrastrarImg=cartaArrastrar
}

function cargarSol()
{
	solImg={
		img: loadImage("img/Otras/sol.png"),
		posX: Math.floor(random(200,1000)),
		posY: Math.floor(random(-150,-350)),
		tamX: 50,
		tamY: 50,
		velocidad: 0.4,
		tiempoMostrarSol: 600,
		limite: Math.floor(random(50,580)),
	}
}

function cargarPodadoras(x)
{
	let posX=165
	let posY
	let posLineaPodadora

	switch(x)
	{
		case 0:
			posY=100
			posLineaPodadora=1
		break

		case 1:
			posY=200
			posLineaPodadora=2
		break

		case 2:
			posY=310
			posLineaPodadora=3
		break

		case 3:
			posY=415
			posLineaPodadora=4
		break	

		case 4:
			posY=520
			posLineaPodadora=5
		break
	}
	let podadora={
		img: loadImage("img/Plantas/podadora.png"),
		posX: posX,
		posY: posY,
		posLineaPodadora: posLineaPodadora,
		tamX: 90,
		tamY: 70,
		velocidad: 0.8,
		limite: 1000,
		utilizado: false,
		activar: false,
	}
	podadoras.push(podadora)
}

function cargarCarta(x)
{
	let posX=285+x*75
	let posY=8
	let tamX=70
	let tamY=70

	switch(x)
	{
		case 0:
			costo=50
		break

		case 1:
			costo=100
		break

		case 2:
			costo=125
		break

		case 3:
			costo=125
		break

		case 4:
			costo=175
		break

		case 5:
			costo=300
		break

		case 6:
			costo=1000
		break
	}

	let carta={
		img: loadImage(`img/Cartas/${x}.png`),
		posX: posX,
		posY: posY,
		tamX: tamX,
		tamY: tamY,
		nombre: x,
		costo: costo,
	}
	cartasImg.push(carta)
}

function mouseClicked()
{
	//Valida que solo se realize una accion a la vez
	let accion=false

	//Click a un sol
	if(accion==false) 
	{
		if(mouseX>solImg.posX && mouseX<solImg.posX+50 && mouseY>solImg.posY && mouseY<solImg.posY+50)
		{
			accion=true
			cargarSol()
			soles+=25
		}
	}

	if(accion==false)
	{
		if(mouseX>=900 && mouseX<=965 && mouseY>=10 && mouseY<=35 && !gameComplete.activo && !gameOver.activo)
		{
			accion=true

			if(play)
				play=false
			else
				play=true

			if(sonidos[1].volumen==1)
			{
				sonidos[1].audio.setVolume(0)
				sonidos[1].volumen=0
			}
			else
			{
				sonidos[1].audio.setVolume(1)
				sonidos[1].volumen=1
			}
		}
	}

	//Click a un sol de un girasol
	if(accion==false)
	{
		let salir=false

		for(let x=0; x<plantas.length; x++)
		{
			if(plantas[x].tipoPlanta==0 && plantas[x].mostrarSol && !salir)
			{
				if(mouseX>plantas[x].posXBala && mouseX<plantas[x].posXBala+50 && mouseY>plantas[x].posYBala && mouseY<plantas[x].posYBala+50)
				{
					accion=true
					salir=true
					plantas[x].mostrarSol=false
					plantas[x].tiempoRecargaSol=plantas[x].tiempoRecargaSolAux
					soles+=25
				}
			}
		}
	}

	//Click a una carta
	if(accion==false)
	{
		let encontrePlanta=false 
		let x=0
		presione++

		while(x<cartasImg.length && encontrePlanta==false)
		{
			if(mouseX>cartasImg[x].posX && mouseX<cartasImg[x].posX+70 && mouseY>cartasImg[x].posY && mouseY<cartasImg[x].posY+70)
			{
				accion=true
				encontrePlanta=true
				plantaSeleccionada=true
				presione=1

				cartaSeleccionada={
					nombre: cartasImg[x].nombre,
					costo: cartasImg[x].costo,
				}

				if(soles>=cartasImg[x].costo)
				{
					cartaArrastrarImg.activada=true
					cartaArrastrarImg.img=loadImage("img/Cartas/"+cartasImg[x].nombre+".png");
					cartaArrastrarImg.posX=mouseX-cartaArrastrarImg.tamX/2
					cartaArrastrarImg.posY=mouseY-cartaArrastrarImg.tamY/2
				}
				else
					txtInformativo.activada=true
			}
			x++
		}

		if(plantaSeleccionada && presione>=2)
		{
			if(soles>=cartaSeleccionada.costo)
				inicializarPlanta(mouseX, mouseY, cartaSeleccionada.nombre, cartaSeleccionada.costo)

			plantaSeleccionada=false
			presione=0
			cartaArrastrarImg.activada=false
		}
	}
}

function cargarZombie()
{
	zombies.push(inicializarZombie())
}

function inicializarZombie()
{
	let posXzombie=Math.floor(random(1350,1600))
	//let posXzombie=Math.floor(random(300,500))
	let posYzombie
	let lineaUbicadoZombie
	let vida
	let anchoZombie
	let altoZombie
	let congelado=false
	let tipoZombie
	let danio=1
	let sprites=15
	let posSprites=0

	switch(Math.floor(random(1,6)))
	{
		case 1:
			posYzombie=55
			lineaUbicadoZombie=1
		break

		case 2:
			posYzombie=165
			lineaUbicadoZombie=2
		break

		case 3:
			posYzombie=270
			lineaUbicadoZombie=3
		break

		case 4:
			posYzombie=375
			lineaUbicadoZombie=4
		break

		case 5:
			posYzombie=485
			lineaUbicadoZombie=5
		break
	}

	let auxNivel

	if(nivel==1)
		auxNivel=1
	else
		if(nivel==2)
			auxNivel=3
		else
			auxNivel=5

	switch(Math.floor(random(1, auxNivel)))
	{
		case 1:
			vida=8
			tipoZombie=0
			anchoZombie=70
			altoZombie=100
			posYzombie+=13
		break

		case 2:
			vida=12
			tipoZombie=1
			anchoZombie=105
			altoZombie=120
			posSprites=0
			sprites=50
		break

		case 3:
			vida=16
			tipoZombie=2
			anchoZombie=90
			altoZombie=115
			sprites=30
		break

		case 4:
			vida=32
			tipoZombie=3
			posXzombie-=100
			posYzombie-=70
			anchoZombie=210
			altoZombie=210
			danio=1000
			sprites=37
		break
	}

	let zombie={
		vida: vida,
		auxVida: vida,
		posLineaZombie: lineaUbicadoZombie,
		posX: posXzombie,
		posY: posYzombie,
		tamX: anchoZombie,
		tamY: altoZombie,
		velocidadMovimiento: 0.3,
		velocidadMovimientoAux: 0.3,
		listoParaDisparar: false,
		tipoZombie: tipoZombie,
		congelado: congelado,
		danio: danio,
		sprites: sprites,
		posSprites: posSprites,
		zombieActivado: true,
	}

	return zombie
}

function inicializarPlanta(posX, posY, cartaNombre, cartaCosto)
{
	let rutaImg="img/Plantas/"
	let rutaImgBala="img/Plantas/"
	let posPlantaX=191
	let posPlantaY
	let ubicacionPlantaMapa
	let tamX
	let tamY
	let costo
	let lineaUbicadaPlanta
	let vida
	let velocidadBala=0
	let tipoPlanta
	let plantaHielo=false
	let danio

	let posXBala
	let posYBala
	let tamXbala=25
	let tamYbala=25
	let tiempoRecarga=200

	if(posY<=196)
	{
		lineaUbicadaPlanta=1
		posPlantaY=96
	}
	else
	{
		if(posY<=298)
		{
			lineaUbicadaPlanta=2
			posPlantaY=198		
		}
		else
		{
			if(posY<=410)
			{
				lineaUbicadaPlanta=3
				posPlantaY=310
			}
			else
			{
				if(posY<=513)
				{
					lineaUbicadaPlanta=4
					posPlantaY=413
				}
				else
				{
					lineaUbicadaPlanta=5
					posPlantaY=520
				}
			}
		}
	}
	if(posX<=326)
	{
		ubicacionPlantaMapa=1
		posPlantaX=250
	}
	else
		if(posX<=397)
		{
			ubicacionPlantaMapa=2
			posPlantaX=330
		}
		else
			if(posX<=486)
			{
				ubicacionPlantaMapa=3
				posPlantaX=410
			}
			else
				if(posX<=561)
				{
					ubicacionPlantaMapa=4
					posPlantaX=490
				}
				else
					if(posX<=644)
					{
						ubicacionPlantaMapa=5
						posPlantaX=570
					}
					else
						if(posX<=719)
						{
							ubicacionPlantaMapa=6
							posPlantaX=650
						}
						else
							if(posX<=798)
							{
								ubicacionPlantaMapa=7
								posPlantaX=730
							}
							else
								if(posX<=872)
								{
									ubicacionPlantaMapa=8
									posPlantaX=810
								}
								else
								{
									ubicacionPlantaMapa=9
									posPlantaX=890
								}
	let cuadroOcupado=false

	for(let x=0; x<plantas.length; x++)
	{
		if(ubicacionPlantaMapa==plantas[x].ubicacionPlantaMapa && lineaUbicadaPlanta==plantas[x].posLineaPlanta && plantas[x].plantaActivada)
			cuadroOcupado=true
	}

	if(!cuadroOcupado)
	{
		soles-=cartaCosto
		sonidos[2].audio.play()

		switch(cartaNombre)
		{
			case 0:
				rutaImg+="girasol.png"
				rutaImgBala="img/Otras/sol.png"
				costo=50
				tamX=74
				tamY=73
				posXBala=posPlantaX+30
				posYBala=posPlantaY
				vida=180
				tipoPlanta=0
				tamXbala=50
				tamYbala=50
				tiempoRecarga=400
			break

			case 1:
				rutaImg+="lanzaguisantes.png"
				rutaImgBala+="ataqueGuisante.png"
				costo=100
				tamX=70
				tamY=70
				posXBala=posPlantaX+60
				posYBala=posPlantaY
				vida=180
				velocidadBala=1
				tipoPlanta=1
				danio=1
			break

			case 2:
				rutaImg+="nuez.png"
				costo=125
				tamX=120
				tamY=120
				posPlantaX-=20
				posPlantaY-=20
				posXBala=posPlantaX+60
				posYBala=posPlantaY
				vida=1500
				tipoPlanta=2
			break

			case 3:
				rutaImg+="chile.png"
				rutaImgBala+="balaChile.png"
				costo=125
				tamX=90
				tamY=90
				posPlantaX-=15
				posXBala=250
				posYBala=posPlantaY
				tamXbala=800
				tamYbala=80
				vida=90
				tipoPlanta=6
				danio=16
				tiempoRecarga=100
			break

			case 4:
				rutaImg+="lanzaguisantesHielo.png"
				rutaImgBala+="ataqueGuisanteHielo.png"
				costo=175
				tamX=70
				tamY=70
				posXBala=posPlantaX+60
				posYBala=posPlantaY
				vida=180
				velocidadBala=1
				tipoPlanta=3
				plantaHielo=true
				danio=1.2
			break

			case 5:
				rutaImg+="sandia.png"
				rutaImgBala+="ataqueSandia.png"
				costo=300
				tamX=125
				tamY=105
				posPlantaX-=28
				posPlantaY-=20
				posXBala=posPlantaX+60
				posYBala=posPlantaY+50
				vida=150
				velocidadBala=1
				tipoPlanta=4
				danio=1.4
			break

			case 6:
				rutaImg+="bills.png"
				rutaImgBala+="energiaDestruccion.png"
				costo=1000
				tamX=125
				tamY=105
				posPlantaX-=28
				posPlantaY-=20
				posXBala=posPlantaX+60
				posYBala=posPlantaY+50
				vida=150
				velocidadBala=1
				tipoPlanta=5
				danio=costo
			break
		}

		let planta={
			img: loadImage(rutaImg),
			posX: posPlantaX,
			posY: posPlantaY,
			ubicacionPlantaMapa: ubicacionPlantaMapa,
			tamX: tamX,
			tamY: tamY,
			posLineaPlanta: lineaUbicadaPlanta,
			costo: costo,
			vida: vida,
			tipoPlanta: tipoPlanta,
			plantaHielo: plantaHielo,
			imgBala: loadImage(rutaImgBala),
			posXBala: posXBala,
			posXBalaAux: posXBala,
			posYBala: posYBala,
			tamXbala: tamXbala,
			tamYbala: tamYbala,
			velocidadBala: velocidadBala,
			danio: danio,
			listoParaDisparar: false,
			plantaActivada: true,
			tiempoRecarga: tiempoRecarga,
			tiempoRecargaAux: tiempoRecarga,
			tiempoRecargaOriginal: tiempoRecarga,
			tiempoRecargaSol: tiempoRecarga,
			tiempoRecargaSolAux: tiempoRecarga,
			tiempoMostrarSol: 600,
			tiempoMostrarSolAux: 600,
			tiempoRecargaChile: tiempoRecarga,
			tiempoMostrarChile: 80,
			plantaUsada: false,		
			mostrarSol: false,
			mostrarChile: false,
		}

		plantas.push(planta)
	}
}