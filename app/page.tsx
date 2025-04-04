"use client";
import styles from "./page.module.css";
import GridVisualization from "@/app/GridVisualization";
import {
    ComplexCoordinate,
    GridValues,
    LOWER_LIMIT, LRUCache,
    range,
    roundNumber,
    STEP_SIZE,
    UPPER_LIMIT
} from "@/app/constants";
import {useRef, useState} from "react";

const INITIAL_NUM_ITERATIONS = 2; // number of iterations after which to collect the magnitude

function updateValue(currentCoord: ComplexCoordinate, initialCoord: ComplexCoordinate, squareCache: LRUCache<ComplexCoordinate>): ComplexCoordinate {
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


function getValue(initialCoord: ComplexCoordinate, iteration: number, squareCache: LRUCache<ComplexCoordinate>): ComplexCoordinate {
    if (iteration === 0) {
        return new ComplexCoordinate(0, 0)
    }
    let out = new ComplexCoordinate(initialCoord.real, initialCoord.imag);
    for (let currentIteration=1; currentIteration<iteration; currentIteration++) {
        out = updateValue(out, initialCoord, squareCache)
    }
    return out;
}

function constructMap(numIterations: number, squareCache: LRUCache<ComplexCoordinate>): GridValues {
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
    return result;
}

function updateMap(currentMap: GridValues, squareCache: LRUCache<ComplexCoordinate>) {
    range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).forEach((yCoordUnrounded) => {
        const yCoord = roundNumber(yCoordUnrounded)
        const rowValues = currentMap.get(yCoord)!;
        range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).forEach((xCoordUnrounded) => {
            const xCoord = roundNumber(xCoordUnrounded)
            const updatedValue = updateValue(rowValues.get(xCoord)!, new ComplexCoordinate(xCoord, yCoord), squareCache)
            rowValues.set(xCoord, updatedValue)
        })
    })
    console.log('updating: cache hit rate') // should be > 50% (since when we get a miss we read back from the cache)
    console.log(squareCache.cacheHits / (squareCache.cacheHits + squareCache.cacheMisses))
}

const squareCache = new LRUCache<ComplexCoordinate>(1);
const magnitudeCache = new LRUCache<number>(10000);

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
        <GridVisualization values={mapRef.current} magnitudeCache={magnitudeCache}/>
      </main>
    </div>
  );
}
