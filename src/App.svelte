<script lang="ts">
  import { Game } from "./api/game";
  import { LoadImage } from "./utils/load";

  interface GameInfo {
    name: string
    width: number
    icon: string
    height: number
    numColors: number
  }

  let gameType = false
  let selectedGame = 'Apple'

  function showBW() {
    gameType = false;
  };

  function showColor() {
    gameType = true;
  };

  let selectGame = (game: string) => () => {
      selectedGame = game
      g.canvas.switchGame(game)
  }

  const bwGames: GameInfo[] = [
    {name: "Apple", icon: './boards/apple.png', width: 18, height: 16, numColors: 1},
    {name: "Bird", icon: './boards/bird.png', width: 15, height: 16, numColors: 1},
    {name: "Dolphin", icon: './boards/dolphin.png', width: 18, height: 18, numColors: 1},
    {name: "Elephant", icon: './boards/elephant.png', width: 11, height: 11, numColors: 1},
    {name: "Fish", icon: './boards/fish.png', width: 11, height: 11, numColors: 1},
    {name: "Kettle", icon: './boards/kettle.png', width: 11, height: 11, numColors: 1},
    {name: "Panther", icon: './boards/panther.png', width: 11, height: 11, numColors: 1},
    {name: "Pizza", icon: './boards/pizza.png', width: 11, height: 11, numColors: 1},
    {name: "Seahorse", icon: './boards/seahorse.png', width: 11, height: 11, numColors: 1},
  ]

  const colorGames: GameInfo[] = [
    {name: "Card", icon: './boards/card.png', width: 11, height: 11, numColors: 2},
    {name: "Butterfly", icon: './boards/butterfly.png', width: 18, height: 16, numColors: 5},
    {name: "Burger", icon: './boards/burger.png', width: 18, height: 18, numColors: 6},
    {name: "Lily", icon: './boards/water_lily.png', width: 15, height: 16, numColors: 6},
  ];

  const assets = {};
  const g = new Game(assets);
  (async () => {
    let manifest = await fetch('./src/assets/assets.json').then((x) => x.json());
    let imageArr = await Promise.all(manifest.map(({name, link}: {[index: string]: string}): any => LoadImage(name, link)));
 
    imageArr.forEach(({ name, image }) => assets[name] = image);
      
    g.start()
  })();
</script>

<main>
  <h1 id="title">Nonograms</h1>
  <hr/>
  <div id="app">
    <div id="game">
      <img id="wingif" src="./win.gif" alt="You have won." style="opacity:0"/>
    </div>
    <div id="sidebar">
      <h3>Select Game:</h3>
      <div class="tab">
        <button id="bw" class:selected={!gameType} on:click={showBW}>Black & White Games</button>
        <button id="color" class:selected={gameType} on:click={showColor}>Color Games</button>
      </div>
      <div id="gamelist">
        {#each gameType ? colorGames : bwGames as game}
          <button on:click={selectGame(game.name)} class:selected={game.name == selectedGame}><img id="icon" src={game.icon} alt={game.name}/> Name: {game.name} | Width: {game.width} | Height: {game.height} | Colors: {game.numColors}</button><br/>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .tab button {
    border: 0px solid;
    width: 49%;
    border-radius: 0;
    margin-bottom: 5px;
    padding: 0;
    background-color: #303030;
  }

  .tab button.selected {
    background-color: #404040;
  }

  #app {
    display: flex;
  }

  #game {
    flex: 1
  }

  #sidebar {
    flex: 2
  }

  #wingif {
    height:  50px;
    image-rendering: crisp-edges;
  }

  #icon {
    height: 80px;
    image-rendering: crisp-edges;
  }

  #gamelist {
    width: 600px;
    height: 300px;
    overflow-y: scroll;
  }

  #gamelist button {
    border-color: #000000;
  }

  #gamelist button.selected {
    animation: 0.5s linear forwards select-button;
  }
  #gamelist button.selected img {
    animation: 0.5s linear forwards select-img;
  }

  @keyframes select-button {
    to {
      border-color: #0000ff;
    }
  }

  @keyframes select-img {
    to {
      opacity: 0;
      
    }
  }

  button {
    width: 100%;
    height: 100px;
  }
</style>
