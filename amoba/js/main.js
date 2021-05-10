 const tictactoe = {
  rows : 4,
  cols: 4,
  neededToWin: 3,
  round: 0,
  numMoves: 0,
  maxMoves: 0,
  currentPlayer: 'player1',
  gameOver: false,
  tournamentRounds: 5,
  tournamentOver: false,
  player1: { 
    name: '1. Játékos',
    piece: 'fas fa-times',
    color: 'rgb(255, 153, 0)',
    score: 0,
  },
  player2: {
    name: '2. Játékos',
    piece: 'far fa-circle',
    color: 'rgb(0, 153, 51)',
    score: 0,
  },

  initialiseGame: function ( rows, cols ) {
    for ( let row = 1; row <= this.rows; row++ ) {
      this[row] = {};
      for ( let col = 1; col <= this.cols; col++ ) {
        this[row][col] = '';
      }      
    }
    this.numMoves = 0;
    this.maxMoves = this.rows * this.cols;
    this.gameOver = false;
    this.tournamentOver = false;
    this.round++;
  },

  alreadyFilled: function ( row, col ) {
    return this[row][col] != '';
  },

  playerMove: function ( row, col, piece ) {
    if ( !this.gameOver ) {
      if ( !this.alreadyFilled ( row, col )) {
        this[row][col] = piece;
        this.numMoves++;
        return true;
      }
      return false;
    }
  },

  isGameDrawn: function () {
    return this.numMoves === this.maxMoves;
  },
  
  checkForWin: function ( row, col, piece ) {
    let rowCount = 0;
    let colCount = 0;
    let diagCount = 0;
    let revDiagCount = 0;
    let neededToWin = this.neededToWin;
    let checkCol = 0;

    row = parseInt(row);
    col = parseInt(col);

    for ( let i = 1; i <= this.cols; i++ ) {
      colCount += this[row][i] === piece ? 1 : ( colCount * -1 );

      rowCount += this[i][col] === piece ? 1 : ( rowCount * -1 );

      checkCol = col - row + i;
      if ( checkCol > 0 && checkCol <= this.cols ) {
        diagCount += this[i][checkCol] === piece ? 1 : ( diagCount * -1 );
      }

      checkCol = row + col - i;
      if ( checkCol > 0 && checkCol <= this.cols ) {
        revDiagCount += this[i][checkCol] === piece ? 1 : ( revDiagCount * -1 );
      }

      if (( rowCount === neededToWin ) || ( colCount === neededToWin ) || ( diagCount === neededToWin ) || ( revDiagCount === neededToWin )) {
        return true;
      }
    }
    return false;
  },
 }

const drawBoard = function ( numRows, numCols ) {
  const $gameboard = $('#gameboard');
  const gameboardWidth = parseInt($gameboard.width());
  const tileSpacing = 3;
  const tileSize = ( gameboardWidth / numCols ) - ( tileSpacing * 2 );

  $('#gameheadermessage > h6').text(`Egymás után ${ tictactoe.neededToWin } nyer`);

  const $endmessage = $('#gameendmessage');
  const paddingTop = ( gameboardWidth / 2 ) - 60;
  const paddingLeftRight = 30;
  $endmessage.css({ 
    'height': `${ gameboardWidth - paddingTop }px`,
    'padding': `${ paddingTop }px ${ paddingLeftRight }px 0`,
    'width': `${ gameboardWidth - ( paddingLeftRight * 2 ) }px`
  });

  for ( i = 1; i <= numRows; i++ ) {    
    for ( j = 1; j <= numCols; j++ ) {
      let tileId = `tile${ i }-${ j }`;
      $gameboard.append(`<div class='tile' id='${ tileId }' row='${ i }' col='${ j }'></div>`);

      $('#' + tileId).append(`<div class='icon'></span>`);
    }
  }

  const $tiles = $('.tile');
  $tiles.css({
    'height': `${ tileSize }px`,
    'width': `${ tileSize }px`,
    'margin': `${ tileSpacing }px`,
    'font-size': `${ tileSize * 0.5 }px`
  });

  const $icons = $('.icon');
  $icons.css({ 'margin-top': `${ tileSize * 0.5 / 2}px`});
} 

const setupScoreTable = function () {
  const $scoreTable = $('#scoretable');
  $scoreTable.empty();
  $scoreTable.append('<thead></thead>').append('<tbody></tbody>').append('<tfoot></tfoot>');

  updateScoreTableHeader ();
  $('#scoretable > tfoot').append(`<tr><td>Összesen</td><td id="player1score">0</td><td id="player2score">0</td></tr>`);

  $('#scorefooter > h2').empty();
} 

const updateScoreTableHeader = function () {
  const tournamentRounds = tictactoe.tournamentRounds;

  $('#scoreheadermessage > h6').text(`Legjobb ${ tournamentRounds } ${ tournamentRounds === 1 ? ' kör' : ' körből' } Nyer`)

  $('#scoretable > thead').empty();

  const player1name = tictactoe.player1.name;
  const player2name = tictactoe.player2.name;
  $('#scoretable > thead').append(`<tr><th>#</th><th>${ player1name }</th><th>${ player2name }</th></tr>`);
} 

const updateScoreTable = function ( winningPlayer ) {
  const round = tictactoe.round;
  let player1score = 'dönteten';
  let player2score = 'döntetlen';

  if ( winningPlayer === 'player1' || winningPlayer === 'player2' ) {
    tictactoe[winningPlayer].score++;
    player1score = winningPlayer === 'player1' ? 1 : '';
    player2score = winningPlayer === 'player2' ? 1 : '';  
  }
 
  $('#scoretable > tbody').append(`<tr><td>${ round }</td><td>${ player1score }</td><td>${ player2score }</td></tr>`);

  $('#player1score').text( tictactoe.player1.score );
  $('#player2score').text( tictactoe.player2.score );

  let tournamentWinner = '';
  let tournamentWinnerName = '';

  if ( round === tictactoe.tournamentRounds ) {
    const confettiDuration = 5000;
    tictactoe.tournamentOver = true;

    if ( tictactoe.player1.score === tictactoe.player2.score ) {
      $('#scorefooter > h2').text('A meccs döntetlen lett');
    } else {
      tournamentWinner = tictactoe.player1.score > tictactoe.player2.score ? 'player1' : 'player2';
      tournamentWinnerName = tictactoe[tournamentWinner].name;

      $('#scorefooter > h2').text(`${ tournamentWinnerName } Nyerte a meccset`);

      const mp = 150;
      const particleColors = {
            colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
            colorIndex: 0,
            colorIncrementer: 0,
            colorThreshold: 10
      }

      $.confetti.restart();
      setTimeout( function() { $.confetti.stop(); }, confettiDuration );      
    }
  }
} 

const tileClickHandler = function () {
  const clickedSquareId =  this.id;
  const $clickedSquare = $('#' + clickedSquareId);
  const row = $clickedSquare.attr('row');
  const col = $clickedSquare.attr('col');
  const playerPiece = tictactoe[tictactoe.currentPlayer].piece;

  if( tictactoe.playerMove ( row, col, playerPiece )) {
    const $icon = $('#' + clickedSquareId + ' .icon');
    $icon.addClass( playerPiece );

    const playerColor = tictactoe[tictactoe.currentPlayer].color;
    $clickedSquare.css({ 'background-color': playerColor });
        
    if( tictactoe.checkForWin( row, col, playerPiece )) {
      const playerName = tictactoe[tictactoe.currentPlayer].name;
      $('#gameendmessage').css({ 'display': 'inline' }).text(`${ playerName } nyerte a kört`)
      tictactoe.gameOver = true;
      updateScoreTable ( tictactoe.currentPlayer );
      tictactoe.currentPlayer = tictactoe.currentPlayer === 'player1' ? 'player2' : 'player1';
      $('#configbutton').prop('disabled', true);
      return true;
    } else if ( tictactoe.isGameDrawn()) {
      $('#gameendmessage').css({ 'display': 'inline' }).text('Döntetlen kör');
      tictactoe.gameOver = true;
      updateScoreTable ();
      tictactoe.currentPlayer = tictactoe.currentPlayer === 'player1' ? 'player2' : 'player1';
      $('#configbutton').prop('disabled', true);
      return true;
    }
    tictactoe.currentPlayer = tictactoe.currentPlayer === 'player1' ? 'player2' : 'player1';
  }
}

const restartButtonHandler = function () {
  if ( !tictactoe.gameOver ){
    tictactoe.round--;
  }

  if ( tictactoe.tournamentOver ) {
    setupScoreTable();

    tictactoe.round = 0;

    tictactoe.player1.score = 0;
    tictactoe.player2.score = 0;
  }

  tictactoe.initialiseGame();

  $('#gameendmessage').css({ 'display': 'none' });

  $('.tile').css({ "background-color": "" });

  let $icons = $('.icon');
  $icons.removeClass( tictactoe.player1.piece );
  $icons.removeClass( tictactoe.player2.piece );

  $('#configbutton').prop('disabled', false);
} 

const configButtonHandler = function () {
  $('#configform').css({ 'display': 'block' });

  $('#player1name').val(tictactoe.player1.name);
  $('#player2name').val(tictactoe.player2.name);
  $('#gridsize').val(String(tictactoe.cols));
  $('#winsize').val(String(tictactoe.neededToWin));
  $('#tournamentrounds').val(String(tictactoe.tournamentRounds));
} 

const configSaveButtonHandler = function () {
  let nameChange = false;
  let gridChange = false;
  let winChange = false;
  let roundsChange = false;

  const player1name = $('#player1name').val().trim();
  const player2name = $('#player2name').val().trim();
  const gridSize = Number( $('#gridsize').val() );
  const winSize = Number( $('#winsize').val() );
  const tournamentRounds = Number( $('#tournamentrounds').val() );

  if ( player1name != '' && player1name != tictactoe.player1.name ) {
    tictactoe.player1.name = player1name;
    nameChange = true;
  }

  if ( player2name != '' && player2name != tictactoe.player2.name ) {
    tictactoe.player2.name = player2name;
    nameChange = true;
  }

  if ( gridSize != tictactoe.cols ) {
    tictactoe.cols = gridSize;
    tictactoe.rows = gridSize;
    gridChange = true;
  }

  if ( winSize != tictactoe.neededToWin ) {
    tictactoe.neededToWin = winSize;
    winChange = true;
  }

  if ( tournamentRounds != tictactoe.tournamentRounds ) {
    tictactoe.tournamentRounds = tournamentRounds;
    roundsChange = true;
  }

  if ( nameChange ) {
    updateScoreTableHeader();
  }

  if ( gridChange || winChange || roundsChange ) {
    $('.tile').remove();
    tictactoe.initialiseGame();
    tictactoe.round = 1;
    tictactoe.currentPlayer = 'player1';
    tictactoe.player1.score = 0;
    tictactoe.player2.score = 0;
    drawBoard( tictactoe.rows, tictactoe.cols );
    setupScoreTable();
    setupClickHandlers();
    setupConfigButton();
  }

  $('#closeconfig').trigger('click');
} 

const setupConfigButton = function () {
  $('#closeconfig').on('click', function() {
    $('#configform').css({ 'display': 'none' });
  });
} 

const setupClickHandlers = function () {
  $('.tile').on('click', tileClickHandler);

  $('#restartbutton').on('click', restartButtonHandler);

  $('#configbutton').on('click', configButtonHandler);

  $('#configSaveButton').on('click', configSaveButtonHandler);  

  setupConfigButton();
}

$(function() {
  tictactoe.initialiseGame();
  drawBoard( tictactoe.rows, tictactoe.cols );
  setupScoreTable();

  setupClickHandlers();
});