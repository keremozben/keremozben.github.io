/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var LEVEL = location.search.split("=")[1];
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('load', app.onDeviceReady(), false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		
		Levels[LEVEL].createGrid();
		
    }
};

var Game = {
	
	//Bu fonksiyon sadece grid i otomatik cozerken kullaniliyor
	
}

var	stepMoveCount = [];

function solveAll( level ){
	for(var _y = 0, Y = level.gridMatrix.length; _y < Y; _y++){
		for(var _x = 0, X = level.gridMatrix[_y].length; _x < X; _x++){
			solve( [ _y , _x ], stepMoveCount, level );
		}
	}
}
var availableSolutionCount = [];
function solve( array, sols, level ){
	var
		x,
		grid,
		k,
		str,
		b,
		grids = $('.grid.active'),
		n = level.totalAvailableGrid();
	do{
		if( sols.length == 0 ){
			grid = array;
			x = level.getAvailableGrids( array );
		} else {
			grid = false;
			for( k = sols.length-1; k >= 0; k-- ){
				if( sols[k].length == 0 ){
					grids.filter(':contains(' + sols.length + ')').empty();
					sols.pop();
					if(sols.length > 0){
						sols[sols.length-1].shift();
					} else {
						break;
					}
				} else {
					break;
				}
			}
			if(sols.length > 0){
				x = level.getAvailableGrids( sols[sols.length-1][0] );
			} else {
				console.log('Bitti');
			}
		}
		sols.push( x );
		if( !(sols.length == 1 && sols[0].length == 0) ){
			grid ? $('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').text(sols.length) : $('.grid[data-x="'+sols[sols.length-2][0][1]+'"][data-y="'+sols[sols.length-2][0][0]+'"]').text(sols.length)
		}
		if( sols.length == n ){
			console.log('Çözüldü');
			str = '';
			b = 0;
			for(; b < n; b++ ){
				str += grids.eq(b).text() + ' ';
			}
			availableSolutionCount.push( str );
		}
		
	} while (sols.length > 0)
}

function GenerateLevel( _level, _gridMatrix, _locked ){
	var self = this;
	this.level = _level;
	this.gridMatrix = _gridMatrix;
	this.locked = _locked;
	this.current = 1;
	this.gridWidth = function(){
		return 280 / self.gridMatrix[0].length;
	}
	this.gridHeight = function(){
		return 280 / self.gridMatrix.length;
	}
	this.totalAvailableGrid = function(){
		var row = self.gridMatrix.length;
		var col = self.gridMatrix[0].length;
		var indexer = 0;
		for(var i = 0; i < row; i++){
			for( var j = 0; j < col; j++ ){
				if( self.gridMatrix[i][j] === 1 ){
					indexer++;
				}
			}
		}
		return indexer;
	}
	this.createGrid = function(){
		self.destroyGrid();
		var row = self.gridMatrix.length;
		var col = self.gridMatrix[0].length;
		var indexer = 0;
		for(var i = 0; i < row; i++){
			for( var j = 0; j < col; j++ ){
				if( self.gridMatrix[i][j] === 1 ){
					$('#gridHolder').append(
						$('<div />').attr({
							class : 'grid active'
						}).css({
							width : self.gridWidth(),
							height : self.gridHeight()
						}).attr({
							'data-x' : j,
							'data-y' : i
						}).bind('click',function(){
							self.findAvailableGrids( [ $(this).data('y'), $(this).data('x') ] );
						})
					);
				} else {
					$('#gridHolder').append(
						$('<div />').attr({
							class : 'grid passive'
						}).css({
							width : self.gridWidth(),
							height : self.gridHeight()
						}).attr({
							'data-x' : j,
							'data-y' : i
						})
					);
				}
			}
		}
		$('.level-text span').text( LEVEL );
	}
	this.destroyGrid = function(){
		$('.grid').unbind('click');
		$('#gridHolder').empty();
		self.current = 1;
	}
	this.findAvailableGrids = function(grid){ // grid = [0,0]
		if( $('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').text() != '' ){
			return false; //This Grid Is Unavailable
		} else {
			$('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').addClass('selected');
		}
		
		$('.grid').removeClass('available');
		
		if( grid[0] - 3 < 0 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').text() == "" && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').hasClass('active') ){ //TOP
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').addClass('available');
		}
		if( grid[1] + 3 > self.gridMatrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').text() == "" && $('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').hasClass('active') ){ //RIGHT
			$('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').addClass('available');
		}
		if( grid[0] + 3 > self.gridMatrix.length-1 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').text() == "" && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').hasClass('active') ){ //BOTTOM
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').addClass('available');
		}
		if( grid[1] - 3 < 0 == false && $('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').text() == "" && $('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').hasClass('active') ){ //LEFT
			$('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').addClass('available');
		}
		if( grid[0] - 2 < 0 == false && grid[1] + 2 > self.gridMatrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').hasClass('active') ){ //TOP-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
		}
		if( grid[0] + 2 > self.gridMatrix.length-1 == false && grid[1] + 2 > self.gridMatrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').hasClass('active') ){ //BOTTOM-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
		}
		if( grid[0] + 2 > self.gridMatrix.length-1 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').hasClass('active') ){ //BOTTOM-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
		}
		if( grid[0] - 2 < 0 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').hasClass('active') ){ //TOP-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
		}
		
		self.fillGrid(grid,self.current);
		
	}
	this.fillGrid = function(grid, number){
		$('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').text(number);
		if( number == self.totalAvailableGrid() ){
			win();
		}
		if( $('.grid.available').size() < 1 && number < self.totalAvailableGrid() ){
			lost();
		}
		self.current++;
		self.removeClick();
	}
	this.removeClick = function(){
		$('.grid').unbind('click');
		$('.grid.available').bind('click',function(){
			self.findAvailableGrids( [ $(this).data('y'), $(this).data('x') ] );
		});
	}
	this.clearGrid = function(){
		$('.grid').text('').empty();
	}
	this.getAvailableGrids = function(grid,writeable){
		$('.grid').removeClass('available');

		var temp = [];
		
		if( self.gridMatrix[grid[0]][grid[1]] == 0 ){
			return temp;
		}
		
		if( grid[0] - 3 < 0 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').text() == "" ){ //TOP
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').addClass('available');
			temp.push( [ (grid[0]-3), grid[1] ] );
		}
		if( grid[1] + 3 > self.gridMatrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').text() == "" ){ //RIGHT
			$('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').addClass('available');
			temp.push( [ grid[0], (grid[1]+3) ] );
		}
		if( grid[0] + 3 > self.gridMatrix.length-1 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').text() == "" ){ //BOTTOM
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').addClass('available');
			temp.push( [ (grid[0]+3), grid[1] ] );
		}
		if( grid[1] - 3 < 0 == false && $('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').text() == "" ){ //LEFT
			$('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').addClass('available');
			temp.push( [ grid[0], (grid[1]-3) ] );
		}
		if( grid[0] - 2 < 0 == false && grid[1] + 2 > self.gridMatrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" ){ //TOP-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
			temp.push( [ (grid[0]-2), (grid[1]+2) ] );
		}
		if( grid[0] + 2 > self.gridMatrix.length-1 == false && grid[1] + 2 > self.gridMatrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" ){ //BOTTOM-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
			temp.push( [ (grid[0]+2), (grid[1]+2) ] );
		}
		if( grid[0] + 2 > self.gridMatrix.length-1 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" ){ //BOTTOM-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
			temp.push( [ (grid[0]+2), (grid[1]-2) ] );
		}
		if( grid[0] - 2 < 0 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" ){ //TOP-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
			temp.push( [ (grid[0]-2), (grid[1]-2) ] );
		}
		
		if(writeable){
			self.fillGrid(grid,self.current);
		}
		return temp;
	}
}

var Levels = {
	"1" : new GenerateLevel(1,[	[1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1]	],false),
	"2" : new GenerateLevel(2,[	[0,1,1,1,0], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [0,1,1,1,0]	],false),
	"3" : new GenerateLevel(3,[	[0,1,1,1,0], [1,1,1,1,1], [1,1,0,1,1], [1,1,1,1,1], [0,1,1,1,0]	],false),
	"4" : new GenerateLevel(4,[	[0,1,0,1,0], [1,0,1,0,1], [1,1,0,1,1], [1,0,1,0,1], [0,1,1,1,0]	],false)
}