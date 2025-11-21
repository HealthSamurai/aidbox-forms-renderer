import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"time-wc-drop-down-repeating-options-only",text:"Select a time",type:"time",repeats:!0,control:"drop-down",answerConstraint:"optionsOnly",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),o=JSON.stringify(t.form.questionnaire,null,2),y={title:"Question/time/with item-control/drop-down/repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:o},render:r=>s.jsx(n,{scenario:{name:"time-wc-drop-down-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-drop-down-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,y as default};
