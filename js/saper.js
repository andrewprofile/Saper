var Saper = {
	
		rows:10,
		columns:10,
		bombCount:10,
		board:[],
		table:[],
		play:1,
		fieldCount:0,
		sound:1,	

		hit:function(id) {
			
			if(Saper.sound == 1)
				$("#audioExplode")[0].play();		
			// trafienie
			$("#scope-"+id).addClass('hit');
			$(".field").css({cursor:'default'});
			if ($("#scope-"+id).hasClass("quest")) 
				$("#scope-"+id).addClass('flag1');				
			clearTimeout(Saper.tm);			
			Saper.play = 0;
			Saper.board[id]=2;
			for (var i=0; i<Saper.rows; i++) {
				for (var j=0; j<Saper.columns; j++ ) {
					var ind = i*Saper.columns + j;
					// ustawienie miny z flagą			
					if ($("#scope-"+ind).hasClass("flag")) 					
						$("#scope-"+ind).addClass('flag2');				
			
					if (Saper.board[ind]==1) {
										
						$("#scope-"+ind).addClass('bomb');
						// ustawienie ?  	
						if ($("#scope-"+ind).hasClass("quest")) 					
							$("#scope-"+ind).addClass('flag1');				
						if ($("#scope-"+ind).hasClass("quest") && $("#scope-"+id).hasClass("hit"))					
							$(this).addClass('quest');			
						
					} else if (Saper.board[ind]==0) {
						var pos = Saper.countBombs({x:j, y:i});
						// ustawienie pól
						if (pos==0) {
							Saper.fieldCount++;	
							$("#scope-"+ind).removeClass('quest');	
							$("#scope-"+ind).addClass('empty');							
						} else {						
							$("#scope-"+ind).removeClass('quest');							
							$("#scope-"+ind).addClass('item'+pos);
							if($("#scope-"+ind).hasClass("flag"))
								$("#scope-"+ind).removeClass('item'+pos);							
						}
					}
				}
			}	
		},
		
		positionXY:function(index) {
		
			return {x: index % Saper.columns , y: Math.floor(index/Saper.columns)};		
		},
		
		countBombs:function(xy) {
			var bombs=0;
			for (var x=xy.x-1; x<=xy.x+1; x++) {
				for (var y=xy.y-1; y<=xy.y+1; y++) {
					if (x>=0 && y>=0 && x<Saper.columns && y<Saper.rows) {
						var ind = y*Saper.columns + x;
						if (Saper.board[ind]==1)
							bombs++;
						//ustawienia flag	
						if ($("#scope-"+ind).hasClass("flag") && $("#scope-"+ind).hasClass("bomb"))						
							$("#scope-"+ind).addClass('flag2');					
						else if ($("#scope-"+ind).hasClass("quest") && $("#scope-"+ind).hasClass("bomb"))					
							$("#scope-"+ind).addClass('flag1');				
					}						
				}
			}
			return bombs;
		},
		
		zeroBombs:function(xy) {			
			for (var x=xy.x-1; x<=xy.x+1; x++) {
				for (var y=xy.y-1; y<=xy.y+1; y++) {
					if (x>=0 && y>=0 && x<Saper.columns && y<Saper.rows) {						
						var id = y*Saper.columns+x;
						if (Saper.board[id]!=2) {
							var bombs = Saper.countBombs({x:x, y:y});
							Saper.board[id]=2;
							Saper.fieldCount++;
							if (bombs == 0) {
									//ustawienia flag
									if ($("#scope-"+id).hasClass("quest") && $("#scope-"+id).hasClass("bomb")) 														
										$("#scope-"+id).addClass('flag1');								
									else if($("#scope-"+id).hasClass("flag"))
										return;								
									else {
										$("#scope-"+id).removeClass('quest');	
										$("#scope-"+id).removeClass('flag1');	
										$("#scope-"+id).addClass('empty');
										Saper.zeroBombs({x:x, y:y});
									}								
							} else {
								//ustawienia flag
								if ($("#scope-"+id).hasClass("quest") && $("#scope-"+id).hasClass("bomb")) 										
									$("#scope-"+id).addClass('flag1');					
								else if($("#scope-"+id).hasClass("flag"))
									return;								
								else
									$("#scope-"+id).removeClass('quest');
								$("#scope-"+id).addClass('item'+Saper.countBombs({x:x, y:y}));								
							}
						}
					}						
				}
			}			
		},

		checkFields:function(xy) {
			var id = xy.y*Saper.columns + xy.x;

			if (Saper.board[id]==1) {			
					
				Saper.hit(id);
				return;
			} else {
				var bombs = Saper.countBombs(xy);
				Saper.board[id]=2;
				Saper.fieldCount++;
				if (bombs==0) {
					//ustawienia flag
					if ($("#scope-"+id).hasClass("quest") && $("#scope-"+id).hasClass("bomb"))										
						$("#scope-"+id).addClass('flag1');					
					else if($("#scope-"+id).hasClass("flag"))
						return;								
					else {
						$("#scope-"+id).removeClass('quest');	
						$("#scope-"+id).removeClass('flag1');	
						$("#scope-"+id).addClass('empty');
						if(Saper.sound == 1)
							$("#audioOpening")[0].play();
						Saper.zeroBombs(xy);					
					}
					
				} else {
					//ustawienia flag
					if ($("#scope-"+id).hasClass("quest") && $("#scope-"+id).hasClass("bomb")) 											
						$("#scope-"+id).addClass('flag1');					
					else if($("#scope-"+id).hasClass("flag"))
						return;								
					else {
						$("#scope-"+id).removeClass('quest');
						$("#scope-"+id).addClass('item'+Saper.countBombs(xy));						
					}
				}	
				//wygrana	
				if(Saper.columns*Saper.rows-Saper.fieldCount==10) {
					$(".field").css({cursor:'default'});
					for (var i=0; i<Saper.rows; i++) {
						for (var j=0; j<Saper.columns; j++ ) {
							var ind = i*Saper.columns + j;
							if ($("#scope-"+ind).hasClass("flag"))						
								$(".flag").css({background: '#777 url(flag.ico) no-repeat center'});							
						}
					}
						clearTimeout(Saper.tm);	
						if(Saper.sound == 1)
							$("#audioWin")[0].play();
							
						alert("Gratulacje ;)");
						
						Saper.play = 0;						
				}				
			}			
		},
		//nowa gra
		reset:function(rows, columns, bombs, sounds) {
			Saper.rows = rows;
			Saper.columns = columns;			
			Saper.bombCount = bombs;
			Saper.sound = sounds;
			Saper.play = 1;
			Saper.fieldCount = 0;
			Saper.board.splice(0, Saper.columns*Saper.rows-1);
			Saper.table.splice(0, Saper.columns*Saper.rows-1);			
			//zresetowanie planszy
			$('.field').remove(); 
			Saper.start();
		},	
		//start gry
		start:function(play) {
			Saper.play = play;
			 $(".time span").text(0); 
			for (var i=0; i<Saper.rows*Saper.columns ; i++) {
				Saper.table.push(i);
				Saper.board.push(0);
			}
			
			Saper.table.sort(function(a,b){
				var i = Math.random();				
				if (i>0.5)
					return 1;
				else 
					return -1;
			});
			
			for (var i=0; i<Saper.bombCount; i++) {	
				if(Saper.table[i] == 0)
				{				
				Saper.table[i] = 1;	
				//alert("o:"+Saper.table[i]);	
				}
				if(Saper.board[Saper.table[i]] == Saper.board[Saper.table[i-1]]){
				 	Saper.table.sort(function(a,b){
						var i = Math.random();				
						if (i>0.5)							
							return 1;
						else {							
							return -1;
						}
					});
					Saper.board[Saper.table[i]]=1;					
					//alert("r:"+Saper.table[i-1]);
				} else{
					Saper.board[Saper.table[i]]=1;
					//alert(Saper.table[i]);
				}
			}			

			var board = $('#board');
			
			for (var i=0; i<Saper.rows; i++) {
				for (var j=0; j<Saper.columns; j++ ) {
					
					var counter = i*Saper.columns + j;	
					
					var fields = $('<figure id="scope-'+counter+'" class="field"></figure>');
					$(board).append(fields);					
					switch(counter)
					{
						case 0:
							$('#scope-'+counter).css({borderTopLeftRadius: '6px'});
						break;
						case (Saper.columns - 1):
							$('#scope-'+counter).css({borderTopRightRadius: '6px'});
						break;
						case (Saper.rows*Saper.columns-Saper.columns):
							$('#scope-'+counter).css({borderBottomLeftRadius: '6px'});
						break;
						case (Saper.rows*Saper.columns-1):
							$('#scope-'+counter).css({borderBottomRightRadius: '6px'});
						break;						
					}					
				}
				
			}
			
			
			$("#sapper").append(board);
			$("#sapper").width(Saper.columns*($(".field").width()+1));
			
			$(".field").bind('click',function(){
				
				if (Saper.play == 0)
					return;
				else
				$(".field").css({cursor:'crosshair'});
				if(Saper.sound == 1)
					$("#audioClick")[0].play();	
				var id = $(this).attr('id');
				id = id.substr(6);
				//ustawienia flag
				if ($(this).hasClass("flag")) 
					return false;				
				else{
					$("#scope-"+id).removeClass('quest');

					var xy = Saper.positionXY(id);
					Saper.checkFields(xy);
				}
							
				if(Saper.play != 0 && $(".time span").text() == 0)
					Time();
				function Time(){			
					$(".time span").text(parseInt($(".time span").text()) + 1);
					Saper.tm=setTimeout(Time,1000);
				}
			});

			
			
			$(".field").bind('contextmenu', function(element) {
				
				if (Saper.play==0)
					return;
				else
				$(".field").css({cursor:'help'});
				if($(".time span").text() == 0)
					Time();
				function Time(){			
					$(".time span").text(parseInt($(".time span").text()) + 1);
					Saper.tm=setTimeout(Time,1000);
				}
				var id = $(this).attr('id');
				id = id.substr(6);
				if (Saper.board[id]==2)
					return false;
				if(Saper.sound == 1)
					$("#audioFlag")[0].play();
				//ustawienia flag		
				if ($(this).hasClass("flag")) {
					$(".field").css({cursor:'help'});
					Saper.fieldCount++;
					$("#scope-"+id).removeClass('flag');
					$("#scope-"+id).addClass('quest');
					setTimeout(function(){$(".field").css({cursor:'crosshair'})},1000);	
				} else if ($(this).hasClass("quest")) {					
					setTimeout(function(){$(".field").css({cursor:'crosshair'})},1000);	
					Saper.fieldCount--;
					$("#scope-"+id).removeClass('flag');
					$("#scope-"+id).removeClass('quest');
				} else {
					$("#scope-"+id).removeClass('quest');
					$("#scope-"+id).addClass('flag');
					setTimeout(function(){$(".field").css({cursor:'crosshair'})},1000);	
				}
				
				
				return false;
			});			
		}
		
};

$(document).ready(function(){	
	// wyłanczanie/wyłączanie dźwieków
	$(".sounds").bind('click',function(){		
		if($(".sounds").attr('id') == 0){
			Saper.sound = 1;
			$(".sounds").attr({id:1});
			$('.sounds').css({'background' : 'url(volume_high.png)'}).toggle().fadeIn(500);
			
		} else{
			Saper.sound = 0;
			$(".sounds").attr({id:0});
			$('.sounds').css({'background' : 'url(volume_muted.png)'}).toggle().fadeIn(500);
		}	
	});
	
	$("option").bind('click',function(){
	
		if($(this).hasClass("easy")){
			  rows = 10;
			  cols = rows;
			  bombs = 10;			 
			// nowa gra (easy)
			$(".start").bind('click',function(){
				Saper.reset(rows, cols, bombs,$(".sounds").attr('id'));
			});	
		} else
		if($(this).hasClass("medium")){
			
			rows = 16;
			cols = rows;
			bombs = 40;			
			// nowa gra (medium)
			$(".start").bind('click',function(){				
				Saper.reset(rows, cols, bombs,$(".sounds").attr('id'));
			});			  
		} else 
		if($(this).hasClass("hard")){
			rows = 16;
			cols = 30;
			bombs = 99;	
			// nowa gra (hard)
			$(".start").bind('click',function(){
				Saper.reset(rows, cols, bombs,$(".sounds").attr('id'));
			});			  
		}			
	});
	// nowa gra (domyślna)
	$(".start").bind('click',function(){
		Saper.reset(10, 10, 10,$(".sounds").attr('id'));
	});
	
	Saper.start(0);

});
// wyłanczanie context menu
document.oncontextmenu = function() {return false;}
document.onselectstart = function(){return false;};


