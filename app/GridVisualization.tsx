"use client";
import React from "react";
import {
    ComplexCoordinate,
    GridValues,
    LOWER_LIMIT,
    range,
    roundNumber,
    STEP_SIZE,
    UPPER_LIMIT
} from "@/app/constants";


interface GridVisualizationProps {
    values: GridValues;
}

// TODO: Show coordinate values on hover
// TODO: Move calculations here and calculate on window change

export default function GridVisualization(props: GridVisualizationProps) {
    return (
        <div>
            {/*
            Y (imaginary direction) is rendered from the top down (DOM rules) rather than from the bottom up (math rules)
            */}
            {range(UPPER_LIMIT, LOWER_LIMIT, -STEP_SIZE).map((yCoordUnrounded) => {
                const yCoord = roundNumber(yCoordUnrounded);
                return (
                <div key={yCoord} style={{display: 'flex'}}>{range(LOWER_LIMIT, UPPER_LIMIT, STEP_SIZE).map((xCoordUnrounded) => {
                    const xCoord = roundNumber(xCoordUnrounded)
                const coordKey = `${xCoord},${yCoord}`;
                    const initialCoord = new ComplexCoordinate(xCoord, yCoord);
                const isGrowing = props.values.get(yCoord)!.get(xCoord)!.magnitude() > initialCoord.magnitude();
                    return (
                    <div
                        key={coordKey}
                        style={{width: 10, height: 10, fontSize: 'xx-small', color: 'red', borderWidth: 1, borderColor: yCoord === 0 || xCoord === 0 ? 'red' : 'darkslategrey', borderStyle: 'solid', backgroundColor: isGrowing ? 'darkgray' : 'lightgray'}}
                        data-tooltip-id={coordKey}
                    >{xCoord === 0 && yCoord % .5 === 0 ? yCoord : yCoord === 0 && xCoord % .5 === 0 ? xCoord : ''}</div>
                )})}</div>
            )})}
        </div>
    )
}