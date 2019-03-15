
//lista pelivuoroista joita voidaan vertailla
var turns = {
  player : {}, 
  bot: {}
};

//listat merkeistä joita voidaan vertailla
var marks = {
  empty : {}, 
  cross : {}, 
  circle: {}
};

//pelin luokka joka sisältää tietoa pelin kulusta
class game {
  constructor(){
	  this.play_grid = [[marks.empty,marks.empty,marks.empty],
	  [marks.empty,marks.empty,marks.empty],
	  [marks.empty,marks.empty,marks.empty]];
	  this.turn = turns.bot;
	  this.running = true;
  }
}

//luodaan peli luokka
var gamemanager = new game();

//apufunktiot rivien ja sarakkeiden muuntamiseen suuntaan tai toiseen
function calculaterow(value)
{
	var newrow = 0;
	if(value < 3)
	{
		newrow = 0;
	}
	else if(value > 2 && value < 6)
	{
		newrow = 1;
	}
	else
	{
		newrow = 2;
	}

	return newrow;
}
function calculatecolum(value)
{
	var newcolum = 0;
	
	if(value == 0 || value == 3 || value == 6)
	{
		newcolum = 0;
	}
	else if(value == 1 || value == 4 || value == 7)
	{
		newcolum = 1;
	}
	else
	{
		newcolum = 2;
	}
	
	return newcolum;
}


function gridtovalue(row,colum)
{
	var value = 0;
	if (row == 0) {
		if (colum == 0)
			value = 1;
		else if (colum == 1)
			value = 4;
		else if (colum == 2)
			value = 7;
	}
	else if (row == 1) {
		if (colum == 0)
			value = 2;
		else if (colum == 1)
			value = 5;
		else if (colum == 2)
			value = 8;
	}
	else if (row == 2) {
		if (colum == 0)
			value = 3;
		else if (colum == 1)
			value = 6;
		else if (colum == 2)
			value = 9;
	}

	return value - 1;
}


//funktio jossa kiinnitetään elementteihin funktio jota kutsustaan kun elementtiä clickataan
function setupclickedevents()
{
	//laitetaan neliöille oma funktio jota kutsutaan pelaajan klikatessa
	for(i = 1;i < 10;i++)
	{	
		var elem = "square" + String(i);
	
		var it = i - 1;
		var row = calculaterow(it);
		var colum = calculatecolum(it);

		//merkitään varmuuden vuoksi tyhjäksi
		gamemanager.play_grid[row][colum] = marks.empty;

		var element = document.getElementById(elem);
		if(element){
			element.onclick = function(){
				elementclicked(this);
			};		
		}
	}
	//pelataan ensiksi tekoälyn vuoro
	handleaiturn();
	//funktio joka tarkistaa onko tekoälyn vuoro
	isAiTurn();
}

//kun ikkuna latautuu kutsutaan funktio kerran
 window.onload = setupclickedevents;


 function isAiTurn()
 {
	 //peli on käynnissä ja on tekoälyn vuoro
	 if(gamemanager.running && gamemanager.turn == turns.bot)
	 {
		handleaiturn();
	 }
	 //pieni viive jotta peli ei olisi niin robottimainen
	 var delay = Math.floor((Math.random() * 4000) + 2000);
	 setTimeout(isAiTurn, delay);
 }


function elementclicked(element)
{
	//peli vielä käynnissä ja on pelaajan vuoro
	if(!gamemanager.running || gamemanager.turn == turns.bot)
		return;
	
	var value = 0;
	
	var parse = element.id.replace("square", "");
	
	value = parseInt(parse);
	
	value = value - 1;
	
	var colum = calculatecolum(value);
	var row = calculaterow(value);


	//varmistetaan ettei ole jo pelattu
	if (gamemanager.play_grid[row][colum] == marks.empty) {
		//poistetaan ruudun klikattavuus
		element.className = element.className.replace("clickable", "");
		//merkitään ruutu pelatuksi
		gamemanager.play_grid[row][colum] = marks.cross;
		//pelaaja pelaa ristillä
		element.className += " cross";
		//vaihdetaan tekoälyn vuoroon
		gamemanager.turn = turns.bot;

		//katsotaan joko löytyy voittaja
		checkwin();
	}
}

function stopgame(winner)
{
	//peli on jo pysähtynyt
	if(!gamemanager.running)
		return;

	//poistetaan elementeistä klikattavuus
	for(i = 1;i < 10;i++)
	{	
		var elem = "square" + String(i);
	
		var element = document.getElementById(elem);
		if(element){
			element.className = element.className.replace("clickable", "");
		}
	}
	
	//pysäytetään peli
	gamemanager.running = false;

	//lisätään ilmoitus kumpi voitti
	var div = document.getElementById("instructions");

	if(winner == marks.cross)
	{
		div.innerHTML += "Pelaaja voitti";
	}
	else if(winner == marks.circle)
	{
		div.innerHTML += "Tietokone voitti";		
	}
	else if(winner == marks.empty)
	{
		div.innerHTML += "Kumpikaan ei voittanut";		
	}
	
}

function checkwin() {
	var win = marks.empty;
	//käydään pelikenttä läpi
	for (i = 0; i < 3; i++) {
		//poikittain
		if (gamemanager.play_grid[i][0] == gamemanager.play_grid[i][1] && gamemanager.play_grid[i][1] == gamemanager.play_grid[i][2] && gamemanager.play_grid[i][0] != marks.empty) {
			win = gamemanager.play_grid[i][0];
		}

		//pitkittäin
		if (gamemanager.play_grid[0][i] == gamemanager.play_grid[1][i] && gamemanager.play_grid[1][i] == gamemanager.play_grid[2][i] && gamemanager.play_grid[0][i] != marks.empty) {
			win = gamemanager.play_grid[i % 3][i];
		}
	}

	//sivuttain laskeva
	if (gamemanager.play_grid[0][0] == gamemanager.play_grid[1][1] && gamemanager.play_grid[1][1] == gamemanager.play_grid[2][2] && gamemanager.play_grid[0][0] != marks.empty) {
		win = gamemanager.play_grid[0][0];
	}

	//sivuttain nouseva
	if (gamemanager.play_grid[2][0] == gamemanager.play_grid[1][1] && gamemanager.play_grid[1][1] == gamemanager.play_grid[0][2] && gamemanager.play_grid[2][0] != marks.empty) {
		win = gamemanager.play_grid[2][0];
	}
	//onko voittaja löydetty jos on niin pysätetään peli
	if (win != marks.empty) {
		stopgame(win);
	}

	//katsotaan löytyykö pelikentältä enään yhtää tyhjää ruutua
	var is_full = true;
	for(k = 0;k< 3;k++)
	{
		for(l = 0;l < 3;l++)
		{
			if(gamemanager.play_grid[k][l] == marks.empty)
			{
				is_full = false;
			}
		}
	}
	//jos ei löydy tyhjiä ruutuja niin pysäytetään peli
	if(is_full)
	{
		stopgame(win);
	}
}

function handleaiturn()
{
	var value = 0;
	
	var colum = 0;
	var row = 0;

	var num_col0 = [0,0,0];
	var crosses_col0 = 0;
	var circles_col0 = 0;

	var num_col1 = [0,0,0];
	var crosses_col1 = 0;
	var circles_col1 = 0;
	

	var num_col2 = [0,0,0];
	var crosses_col2 = 0;
	var circles_col2 = 0;
	//katsotaan kenttä läpi ja otetaan muistiin kaikkien ruutujen arvot päättelyä varten
	for(i = 0;i < 3;i++)
	{
		if(gamemanager.play_grid[0][i] == marks.cross)
		{
			num_col0[i] = 2;
			crosses_col0++;
		}
		else if(gamemanager.play_grid[0][i] == marks.circle)
		{
			num_col0[i] = 3;
			circles_col0++;
		}
		else if(gamemanager.play_grid[0][i] == marks.empty)
		{
			num_col0[i] = 1;
		}

		if(gamemanager.play_grid[1][i] == marks.cross)
		{
			num_col1[i] = 2;
			crosses_col1++;
		}
		else if(gamemanager.play_grid[1][i] == marks.circle)
		{
			num_col1[i] = 3;
			circles_col1++;
		}
		else if(gamemanager.play_grid[1][i] == marks.empty)
		{
			num_col1[i] = 1;
		}


		if(gamemanager.play_grid[2][i] == marks.cross)
		{
			num_col2[i] = 2;
			crosses_col2++;
		}
		else if(gamemanager.play_grid[2][i] == marks.circle)
		{
			num_col2[i] = 3;
			circles_col2++;
		}
		else if(gamemanager.play_grid[2][i] == marks.empty)
		{
			num_col2[i] = 1;
		}
	}


	var num_row0 = [0,0,0];
	var crosses_row0 = 0;
	var circles_row0 = 0;
	
	var num_row1 = [0,0,0];
	var crosses_row1 = 0;
	var circles_row1 = 0;
	
	var num_row2 = [0,0,0];
	var crosses_row2 = 0;
	var circles_row2 = 0;
	//katsotaan kenttä läpi toisessa suunnassa ja otetaan muistiin kaikkien ruutujen arvot päättelyä varten
	for(i = 0;i < 3;i++)
	{
		if(gamemanager.play_grid[i][0] == marks.cross)
		{
			num_row0[i] = 2;
			crosses_row0++;
		}
		else if(gamemanager.play_grid[i][0] == marks.circle)
		{
			num_row0[i] = 3;
			circles_row0++;
		}
		else if(gamemanager.play_grid[i][0] == marks.empty)
		{
			num_row0[i] = 1;
		}

		if(gamemanager.play_grid[i][1] == marks.cross)
		{
			num_row1[i] = 2;
			crosses_row1++;
		}
		else if(gamemanager.play_grid[i][1] == marks.circle)
		{
			num_row1[i] = 3;
			circles_row1++;
		}
		else if(gamemanager.play_grid[i][1] == marks.empty)
		{
			num_row1[i] = 1;
		}


		if(gamemanager.play_grid[i][2] == marks.cross)
		{
			num_row2[i] = 2;
			crosses_row2++;
		}
		else if(gamemanager.play_grid[i][2] == marks.circle)
		{
			num_row2[i] = 3;
			circles_row2++;
		}
		else if(gamemanager.play_grid[i][2] == marks.empty)
		{
			num_row2[i] = 1;
		}

	}


	var use_prevent = false;
	var use_win = false;
	//etsitään hyvä ruutu joka pelata
	for (i = 0; i < 3; i++) {
		//kaksi ympyrää
		if (circles_col0 == 2) {
			if (num_col0[i] == 1) {//etsi tyhjä ruutu
				value = gridtovalue(i, 0);//muunnetaan arvo
				use_win = true;
			}
		}
		else if (circles_col1 == 2) {
			if (num_col1[i] == 1) {
				value = gridtovalue(i, 1);
				use_win = true;
			}
		}
		else if (circles_col2 == 2) {
			if (num_col2[i] == 1) {
				value = gridtovalue(i, 2);
				use_win = true;
			}
		}

		if (use_win)
			break;

		//kaksi ruksia
		if (crosses_col0 == 2) {
			if (num_col0[i] == 1) {
				value = gridtovalue(i, 0);
				use_prevent = true;
			}
		}
		else if (crosses_col1 == 2) {
			if (num_col1[i] == 1) {
				value = gridtovalue(i, 1);
				use_prevent = true;
			}
		}
		else if (crosses_col2 == 2) {
			if (num_col2[i] == 1) {
				value = gridtovalue(i, 2);
				use_prevent = true;
			}
		}

	}
	//ei järkevää ruutua vielä
	if (!use_prevent && !use_win) {
		for (i = 0; i < 3; i++) {
			if (circles_row0 == 2) {
				if (num_row0[i] == 1) {
					value = gridtovalue(0, i);
					use_win = true;
				}
			}
			else if (circles_row1 == 2) {
				if (num_row1[i] == 1) {
					value = gridtovalue(1, i);
					use_win = true;
				}
			}
			else if (circles_row2 == 2) {
				if (num_row2[i] == 1) {
					value = gridtovalue(2, i);
					use_win = true;
				}
			}

			if (use_win)
				break;

			if (crosses_row0 == 2) {
				if (num_row0[i] == 1) {
					value = gridtovalue(0, i);
					use_prevent = true;
				}
			}
			else if (crosses_row1 == 2) {
				if (num_row1[i] == 1) {
					value = gridtovalue(1, i);
					use_prevent = true;
				}
			}
			else if (crosses_row2 == 2) {
				if (num_row2[i] == 1) {
					value = gridtovalue(2, i);
					use_prevent = true;
				}
			}
		}
	}
	//onko löydetty ruutu jolla mahdollista voittaa tai estää pelaajan voitto
	if(use_prevent || use_win)
 	{
		//tässä tapauksessa ei tehdä mitään koska ruudun arvo asetetaan aiemmin
	}
	else{//jos ei niin laitetaan satunnaisesti seuraava ruutu
		value = Math.floor((Math.random() * 9) + 0);
		colum = calculatecolum(value);
		row = calculaterow(value);
		//toistetaan niin kauan kunnes löytyy tyhjä ruutu
		while(gamemanager.play_grid[row][colum] != marks.empty)
		{
			value = Math.floor((Math.random() * 9) + 0);	
			colum = calculatecolum(value);
			row = calculaterow(value);
		}
	}

	//varmistetaan sarake ja rivi halutun ruudun arvosta
	colum = calculatecolum(value);
	row = calculaterow(value);
	
	value = value + 1;
	
	var elem = "square" + String(value);

	var element = document.getElementById(elem);
	if (element) {
		//merkitään ruutu pelatuksi
		gamemanager.play_grid[row][colum] = marks.circle;
		//poistetaan klikattavuus
		element.className = element.className.replace("clickable", "");
		//tekoäly pelaa ympyrällä
		element.className += " circle";
		//vaihdetaan pelivuoro
		gamemanager.turn = turns.player;
	}

	//katsotaan löytyykö voittaja
	checkwin();
}


