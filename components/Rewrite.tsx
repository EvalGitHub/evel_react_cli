import * as React from 'react';

import {Box, Text, AppContext  } from 'ink';

import TextInput from 'ink-text-input';

export function Rewrite(props:any) {
  const [isRewrite, setIsRewrite] = React.useState("");
  const [finish, setFinish] = React.useState(false);
  
  const handleSubmit = () => {
    if (isRewrite) {
      //有输入
      if (['y','yes'].includes(isRewrite.toLowerCase())) {
        setIsRewrite('yes');
      } else if (['no', 'n'].includes(isRewrite.toLowerCase())) {
        setIsRewrite('no');
      } else {
        setIsRewrite('');
        return;
      }
    } else {
      // 没输入
      setIsRewrite('no');
    }
    setFinish(true);
  };
  return finish ? FinishComponent(props, isRewrite) : NoFinishComponent(props, props, setIsRewrite, handleSubmit);
}

const FinishComponent = function (props:any, isRewrite:string) {
  return <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        if(isRewrite === "yes"){
          props.callback();
        }
        return <Box />;
      }}
    </AppContext.Consumer>
}

const NoFinishComponent = function (props:any, isRewrite:string, setIsRewrite:Function, handleSubmit:Function) {
  return <Box>
    <Text bold>
      The path '{props.path}' is already exists, do you want to rewrite?(y/N)
    </Text>
    <TextInput
      value={isRewrite}
      onChange={setIsRewrite}
      onSubmit={handleSubmit}
    />
  </Box>
}