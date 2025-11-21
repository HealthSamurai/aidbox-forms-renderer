import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"time-wc-text-box-repeating-options-only",text:"Select a time",type:"time",repeats:!0,control:"text-box",answerConstraint:"optionsOnly",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),t=JSON.stringify(n.form.questionnaire,null,2),y={title:"Question/time/with item-control/text-box/repeating/with answer-options",component:o,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:t},render:r=>s.jsx(o,{scenario:{name:"time-wc-text-box-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-text-box-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,y as default};
