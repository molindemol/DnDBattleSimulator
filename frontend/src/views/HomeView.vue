<script setup lang="ts">
import playerData from '../assets/playerData.json';
import enemyData from '../assets/enemyData.json';
import { ref, watch } from 'vue';

type RollData = {
  name: string;
  image: string;
  initiativeRoll: number;
  ally: boolean;
  hp: number;
};
const selected = ref(enemyData[0]);
const enemyListView = ref([]);
const searchQuery = ref('');
let enemyList = [];
const AllRollsView = ref(null);
let AllRolls: RollData[] = [];
const rolls = ref([]);
const initiatives = ref([]);
const toggler = ref('player');
const addListView = ref([]);
const addToggle = ref(true);
const turnIndicator = ref(0);
let players = structuredClone(playerData);
let deletedEnemy = [];
const filteredListView = ref(structuredClone(enemyData));

function refresh() {
  selected.value = enemyData[0];
  enemyListView.value = [];
  enemyList = [];
  AllRollsView.value = null;
  AllRolls = [];
  rolls.value = [];
  initiatives.value = [];
  toggler.value = 'player';
  addListView.value = [];
  addToggle.value = true;
  turnIndicator.value = 0;
  players = structuredClone(playerData);
  filteredListView.value = structuredClone(enemyData);
  searchQuery.value = '';
  deletedEnemy = [];
}
watch(searchQuery, newValue => {
  filteredListView.value = filteredEnemies(newValue);
});
function addEnemyToLaterList(enemy) {
  const data: RollData = {
    name: enemy.race,
    image: enemy.image,
    initiativeRoll: enemy.initiative + enemy.roll,
    ally: false,
    hp: enemy.hp,
  };
  let count = 2;
  let uniqueName = data.name;
  while (enemyList.concat(deletedEnemy).some(e => e.name == uniqueName)) {
    uniqueName = `${data.name} ${count}`;
    count++;
  }

  addListView.value.push({ ...data, name: uniqueName });
  enemyList.push({ ...data, name: uniqueName });
}
function addEnemyToList(enemy) {
  const data: RollData = {
    name: enemy.race,
    image: enemy.image,
    initiativeRoll: enemy.initiative + enemy.roll,
    ally: false,
    hp: enemy.hp,
  };
  let count = 2;
  let uniqueName = data.name;
  while (enemyList.some(e => e.name == uniqueName)) {
    uniqueName = `${data.name} ${count}`;
    count++;
  }

  enemyListView.value.push({ ...data, name: uniqueName });
  enemyList.push({ ...data, name: uniqueName });
}
function playerLister() {
  for (let i = 0; i < players.length; i++) {
    players[i].initiativeRoll = rolls.value[i] + initiatives.value[i];
  }
  toggler.value = 'enemy';
}

function theEnemyIsDead(enemy) {
  const index = AllRollsView.value.findIndex(
    element => element.name == enemy.name,
  );
  console.log(index);
  console.log(AllRollsView.value);
  let fuckingIndex = 0;
  let valve = null;
  if (AllRollsView.value) {
    valve = AllRollsView.value[turnIndicator.value];
  }

  if (!enemy.ally) {
    fuckingIndex = enemyList.findIndex(element => element.name == enemy.name);
    deletedEnemy.push(enemyList[fuckingIndex]);

    enemyList.splice(fuckingIndex, 1);
  } else {
    fuckingIndex = players.findIndex(player => player.name == enemy.name);
    players.splice(fuckingIndex, 1);
  }

  AllRollsView.value.splice(index, 1);

  if (valve && !(valve == enemy)) {
    turnIndicator.value = AllRollsView.value.indexOf(valve);
  }
  if (turnIndicator.value > AllRollsView.value.length - 1) {
    turnIndicator.value = 0;
  }

}

function projectBalzzz() {
  let valve = null;
  if (AllRollsView.value) {
    valve = AllRollsView.value[turnIndicator.value];
  }
  AllRolls = players.concat(enemyList);
  AllRollsView.value = AllRolls.sort(
    (a, b) => b.initiativeRoll - a.initiativeRoll,
  );
  addListView.value = [];
  addToggle.value = false;
  toggler.value = 'battle';
  if (valve) {
    turnIndicator.value = AllRollsView.value.indexOf(valve);
  }
}

function didSomeoneSayHp(enemyName: string, value: number) {
  const index = AllRollsView.value.findIndex(enemy => enemy.name == enemyName);
  const fuckingIndex = enemyList.findIndex(enemy => enemy.name == enemyName);

  AllRollsView.value[index].hp = value;
  enemyList[fuckingIndex].hp = value;
}
function filteredEnemies(searchQueryL) {
  return enemyData.filter(enemy =>
    enemy.race.toLowerCase().includes(searchQueryL.toLowerCase()),
  );
}
</script>

<template>
  <main>
    <button
      @click="refresh()"
      class="text-center absolute font-bold bg-blue-600 text-white p-4"
    >
      Refresh
    </button>
    <div
      v-if="(toggler !== 'player') & addToggle"
      class="absolute right-0 m-6 border border-black rounded-xl w-1/6 bg-stripes"
    >
      <div class="text-center text-xl flex flex-wrap gap-0.5">
        <input
          v-model="searchQuery"
          placeholder="Search and select..."
          class="w-full border-4 rounded-xl border-blue-700 p-2"
        />
        <div
          @click="selected = enemy"
          class="border-[3px] rounded-xl bg-white cursor-pointer hover:border-blue-700 hover:font-extrabold flex-grow border-black"
          :class="{
            ' border-green-300 font-bold': selected.race == enemy.race,
          }"
          v-for="enemy in filteredListView"
        >
          {{ enemy.race }}
        </div>
      </div>
    </div>
    <div
      class="w-full min-h-screen p-5 flex flex-col justify-center items-center align-middle gap-1"
    >
      <button
        v-if="toggler == 'battle'"
        @click="addToggle = !addToggle"
        class="text-center mb-5 font-bold bg-blue-600 text-white p-4"
      >
        Add toggle
      </button>
      <div
        v-if="toggler == 'player'"
        class="border-2 bg-stripes border-black rounded-xl p-3"
      >
        <div
          v-for="(player, index) in players"
          class="flex place-content-between bg-white rounded-l-full align-middle mb-4 mt-4 border-green-500 border-4 p-0"
        >
          <div class="flex gap-2 justify-between">
            <img
              :src="player.image"
              class="border rounded-full aspect-square"
              width="80"
              height="80"
              alt=""
            />
            <h1 class="self-center font-bold">
              {{ player.name }}
            </h1>
          </div>
          <div class="flex mx-6 self-center">
            <p>Roll:</p>
            <input
              v-model="rolls[index]"
              type="number"
              class="border-3 border h-5 border-black w-12"
            />
            <p>Initiative:</p>
            <input
              v-model="initiatives[index]"
              type="number"
              class="border-3 border h-5 border-black w-16"
            />
          </div>
        </div>
        <button
          @click="playerLister()"
          class="text-center rounded-xl w-full font-bold bg-blue-600 text-white p-4"
        >
          Done
        </button>
      </div>
      <div
        v-if="toggler == 'enemy'"
        class="bg-stripes border-2 rounded-xl border-black p-3 min-w-96"
      >
        <div class="h-[580px] no-scrollbar flex flex-col gap-1 overflow-y-scroll">
          <div
            v-for="player in enemyListView"
            class="flex place-content-between max-h-min bg-white rounded-l-full align-middle border-red-500 grow border-4 p-0"
          >
            <div class="flex justify-between">
              <img
                :src="player.image"
                class="border rounded-full aspect-square"
                width="80"
                height="80"
                alt=""
              />
              <h1 class="self-center font-bold">
                {{ player.name }}
              </h1>
            </div>
            <div class="flex mx-6 gap-2 self-center place-self-end">
              <p class="bg-gray-300 text-center">
                total: {{ player.initiativeRoll }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-2 justify-between">
          <button
            v-if="enemyListView.length > 0"
            @click="
              enemyListView.pop();
              enemyList.pop();
            "
            class="bg-red-600 rounded-xl font-bold p-4 text-white"
          >
            Delete
          </button>
          <button
            @click="projectBalzzz()"
            class="text-center w-full font-bold bg-blue-600 text-white p-4"
          >
            Done
          </button>
        </div>
      </div>

      <div
        v-if="(toggler == 'battle') & !addToggle"
        class="border-black border-2 bg-stripes rounded-xl p-4 flex-col"
      >
        <div class="flex gap-1">
          <div
            @click=""
            v-for="(player, index) in AllRollsView"
            :class="{
              'border-red-500': !player.ally,
              'border-green-500': player.ally,
              '-translate-y-8': index == turnIndicator,
            }"
            class="flex overflow-x-clip max-w-[110px] transition rounded-xl bg-white justify-center text-center grow border-4 p-0 pb-1"
          >
            <div class="flex place-content-between text-wrap flex-col">
              <div>
                <img
                  :src="player.image"
                  class="border rounded-full aspect-square"
                  width="90"
                  height="90"
                  alt=""
                />
                <h1 class="font-bold text-base w-0">
                  {{ player.name }}
                </h1>
              </div>

              <div>
                <div v-if="!player.ally">
                  <h1 class="">HP:</h1>
                  <input
                    @input="didSomeoneSayHp(player.name, $event.target.value)"
                    :value="player.hp"
                    type="number"
                    class="border-3 border font-mono appearance-none p-0.5 text-center border-black w-10"
                  />
                </div>
                <br />
                <button
                  @click="theEnemyIsDead(player)"
                  class="text-center font-bold rounded-xl bg-red-600 text-white w-min p-1"
                >
                  Dead
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full p-4 flex gap-2">
          <button
            @click="
              turnIndicator == 0
                ? (turnIndicator = AllRollsView.length - 1)
                : turnIndicator--
            "
            class="text-center rounded-xl font-bold bg-red-600 text-white p-4"
          >
            Oopsie!
          </button>
          <button
            @click="
              turnIndicator >= AllRollsView.length - 1
                ? (turnIndicator = 0)
                : turnIndicator++
            "
            class="text-center rounded-xl w-full font-bold bg-blue-600 text-white p-4"
          >
            Next Turn
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <div v-if="(toggler == 'battle') & addToggle">
          <div class="border-2 border-black bg-stripes rounded-xl p-3 min-w-96">
            <div class="h-[500px] flex flex-col gap-1 no-scrollbar overflow-y-scroll">
              <div
                v-for="player in addListView"
                class="flex place-content-between max-h-min bg-white rounded-l-full border-red-500 align-middle grow   border-4 p-0"
              >
                <div class="flex justify-between">
                  <img
                    :src="player.image"
                    class="border rounded-full aspect-square"
                    width="80"
                    height="80"
                    alt=""
                  />
                  <h1 class="self-center font-bold">
                    {{ player.name }}
                  </h1>
                </div>
                <div class="flex mx-6 gap-2 self-center place-self-end">
                  <p class="bg-gray-300 text-center">
                    total: {{ player.initiativeRoll }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <button
                v-if="addListView.length > 0"
                @click="
                  addListView.pop();
                  enemyList.pop();
                "
                class="bg-red-600 font-bold p-4 w-full text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="(toggler !== 'player') & addToggle"
          class="border-2 border-black bg-stripes rounded-xl p-3"
        >
          <div
            class="flex place-content-between bg-white rounded-xl align-middle grow mb-4 border-4 p-0"
          >
            <img
              :src="selected.image"
              class="border rounded-full aspect-square"
              width="80"
              height="80"
              alt=""
            />
            <h1 class="self-center font-bold">
              {{ selected.race }}
            </h1>

            <div class="flex mx-6 self-center place-self-end">
              <p>Roll:</p>
              <input
                v-model="selected.roll"
                type="number"
                class="border-3 font-extrabold border h-5 border-black w-12"
              />
              <p>Initiative:</p>
              <p
                v-if="selected.initiative > 0"
                class="bg-gray-300 font-extrabold w-12 text-center"
              >
                +{{ selected.initiative }}
              </p>
              <p v-else class="bg-gray-300 font-extrabold w-12 text-center">
                {{ selected.initiative }}
              </p>
            </div>
          </div>

          <button
            v-if="toggler !== 'battle'"
            @click="addEnemyToList(selected)"
            class="text-center font-bold rounded-xl w-full bg-blue-600 text-white p-4"
          >
            Add
          </button>

          <button
            v-else
            @click="addEnemyToLaterList(selected)"
            class="text-center grow rounded-xl font-bold bg-blue-600 text-white p-4"
          >
            Add
          </button>
          <button
            v-if="toggler == 'battle'"
            @click="projectBalzzz()"
            class="text-center rounded-xl grow ml-3 font-bold bg-blue-600 text-white p-4"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
