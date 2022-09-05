import * as React from 'react';
import { useState } from '@hookstate/core';
import { Log, useLogsState } from "./LogsState";
import { useQueryState } from './QueryState';
import { Card, Typography, Box, CardContent, Button, Grid } from "@material-ui/core";
import { palette } from "@material-ui/system";

import { isFunctionDeclaration } from 'typescript';


function LoadMoreRow(props: { job_id: number, previous_line: number, next_line: number }) {
  const logState = useLogsState();
  const rowsCollapsed = useState(false); 
  return (
    <div
      className="load-more-button">
      <Button
        onClick={function() {
          rowsCollapsed.set(!rowsCollapsed.get());
        logState.setLogLines(
          [
            {
              "term": {
                "job_id": props.job_id
              }
            }
          ],
          1,
          props.next_line - props.previous_line > 100 ? 100 : props.next_line - props.previous_line,
          props.previous_line);

        }
        }
      >Load lines {props.previous_line + 1} - {props.next_line - props.previous_line > 100 ? props.previous_line + 100 : props.next_line - 1}</Button>
    </div>)
}

function LineRow(props: { line: number, content: string }) {
  return (
    <div className="log-line">
      <div className="log-line-number">
        <pre>{props.line}</pre>
      </div>
      <div className="log-line-content">
        <pre>{props.content}</pre>
      </div>
    </div>
  );
}


function LogCard(props: { log: Log }) {
  const collapsed = useState(false);
  const closed = useState(false);
  const descrpState = useState(false);

  const data = Object.values(props.log.lines).reduce((initial: any, line: { line_number: number, content: string }) => {
    if (line.line_number - initial.lastLineNumber > 1) {
      initial.items.push(
        <LoadMoreRow
        key={`${props.log.job_id}-${initial.lastLineNumber + 1}`}
        job_id={props.log.job_id}
        previous_line={initial.lastLineNumber}
        next_line={line.line_number}
        />);
    }
    if (line.line_number - initial.lastLineNumber > 100) {
      initial.items.push(
        <LoadMoreRow
          key={`${props.log.job_id}-${line.line_number - 101}`}
          job_id={props.log.job_id}
          previous_line={line.line_number - 101}
          next_line={line.line_number}
        />);
    }
    initial.items.push(
      <LineRow
        key={`${props.log.job_id}-${line.line_number}`}
        line={line.line_number}
        content={line.content}
      />
    );
    initial.lastLineNumber = line.line_number;
    return initial;
  }, {items: [], lastLineNumber: 0});
  
  return (
    <div id={`log-${props.log.job_id}`} style={{
      display: closed.get() ? 'none' : 'block'
    }}>
      <Box sx={{minWidth: 275}}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">
              JOB {props.log.job_id}
              <Button id='delete-button' onClick={() => closed.set(!closed.get())}>
              ignore
              </Button>
              <Button id='minimize-button' onClick={() =>collapsed.set(!collapsed.get())}>
                {collapsed.get() ? 'expand' : 'hide'}
              </Button>
            </Typography> 
            <Grid container id='search-found' style={{
              display: collapsed.get() ? 'none' : 'block'
            }}>                
              <Grid item>
                <Button variant='outlined' fullWidth={true} onClick={() => descrpState.set(!descrpState.get())} >
                  <Grid container justify="flex-start">
                    <Typography display="block">Description</Typography>
                  </Grid>
                </Button>
                <Box sx={{p: 1, width: 'full', display: descrpState.get() ? 'block' : 'none' }}>
                  <Typography display="block" variant="subtitle1">
                    Job descriptors...
                  </Typography>
                  <Typography display="block" variant="subtitle1">
                    start date/runtime/...
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                {data.items}
                <LoadMoreRow job_id={props.log.job_id} previous_line={data.lastLineNumber} next_line={Number.MAX_VALUE}/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

function highlightSearch() {
  const searchWord = useQueryState();
  console.log(searchWord);
}

export function LogsViewer() {
  const logsState = useLogsState()

  try {
    return <div className="log-list">
      {Object.values(logsState.log).map(log => <LogCard key={log.job_id} log={log}/>)}
    </div>
  } catch (error) {
    return <></>
  }
}
