"use client";
import styles from "./page.module.css";
import GridVisualization from "@/app/GridVisualization";
import {
    ComplexCoordinate,
    GridValues,
    LOWER_LIMIT,
    range,
    roundNumber,
    STEP_SIZE,
    UPPER_LIMIT
} from "@/app/constants";
import {useRef, useState} from "react";

const INITIAL_NUM_ITERATIONS = 2; // number of iterations after which to collect the magnitude

class LRUCache {
    map: Map<string, ComplexCoordinate>
    capacity: number;
    keys: Array<string>;
    cacheMisses: number;
    cacheHits: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        this.keys = [];
        this.cacheMisses = 0;
        this.cacheHits = 0;
    }
    setValue(input: string, value: ComplexCoordinate) {
        if (this.map.has(input)) {
            this.keys = this.keys.filter(k => k !== input);
        }

        this.keys.push(input);
        this.map.set(input, value);
        this.map.set(input, value);
        if (this.map.size > this.capacity) {
            const oldestKey = this.keys.shift();
            if (oldestKey != null) {
                this.map.delete(oldestKey);
            }
        }
    }
    getValue(input: string) {
        if (!this.map.has(input)) {
            this.cacheMisses += 1
            return null;
        }
        this.cacheHits += 1

        const value = this.map.get(input);
        this.keys = this.keys.filter(k => k !== input);
        this.keys.push(input);
        return value;
    }
}

function updateValue(currentCoord: ComplexCoordinate, initialCoord: ComplexCoordinate, squareCache: LRUCache): ComplexCoordinate {
    if (!currentCoord) {
        console.log('undefined coord')
    }
    const squareCacheResult = squareCache.getValue(currentCoord.toString())
    if (!squareCacheResult) {
        squareCache.setValue(currentCoord.toString(), currentCoord.square());
    }
    let out = squareCache.getValue(currentCoord.toString())!;
    out = out.add(initialCoord);
    return out;
}


function getValue(initialCoord: ComplexCoordinate, iteration: number, squareCache: LRUCache): ComplexCoordinate {
    if (iteration === 0) {
        return new ComplexCoordinate(0, 0)
    }
    let out = new ComplexCoordinate(initialCoord.real, initialCoord.imag);
    for (let currentIteration=1; currentIteration<iteration; currentIteration++) {
        out = updateValue(out, initialCoord, squareCache)
    }
    return out;
}

function constructMap(numIterations: number, squareCache: LRUCache): GridValues {
    const result = new Map();
    range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).forEach((yCoordUnrounded) => {
        const yCoord = roundNumber(yCoordUnrounded)
        const rowValues = new Map();
        range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).forEach((xCoordUnrounded) => {
            const xCoord = roundNumber(xCoordUnrounded)
            const coord = new ComplexCoordinate(xCoord, yCoord);
            const coordAfterIterations = getValue(coord, numIterations, squareCache)
            rowValues.set(xCoord, coordAfterIterations)
        })
        result.set(yCoord, rowValues)
    })
    console.log('cache hit rate') // should be > 50% (since when we get a miss we read back from the cache)
    console.log(squareCache.cacheHits / (squareCache.cacheHits + squareCache.cacheMisses))
    return result;
}

function updateMap(currentMap: GridValues, squareCache: LRUCache) {
    range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).forEach((yCoordUnrounded) => {
        const yCoord = roundNumber(yCoordUnrounded)
        const rowValues = currentMap.get(yCoord)!;
        range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).forEach((xCoordUnrounded) => {
            const xCoord = roundNumber(xCoordUnrounded)
            const updatedValue = updateValue(rowValues.get(xCoord)!, new ComplexCoordinate(xCoord, yCoord), squareCache)
            rowValues.set(xCoord, updatedValue)
        })
    })
}

const squareCache = new LRUCache(1000);

export default function Home() {
    const [currentIterations, setCurrentIterations] = useState<number>(INITIAL_NUM_ITERATIONS);
    const mapRef = useRef(constructMap(INITIAL_NUM_ITERATIONS, squareCache));
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          {`Number of iterations: ${currentIterations}`}
          <button onClick={() => {
              setCurrentIterations(currentIterations + 1);
              updateMap(mapRef.current, squareCache);
          }}>Increment iterations</button>
        <GridVisualization values={mapRef.current}/>
      </main>
    </div>
  );
}
