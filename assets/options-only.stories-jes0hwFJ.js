import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"time-wc-spinner-repeating-options-only",text:"Select a time",type:"time",repeats:!0,control:"spinner",answerConstraint:"optionsOnly",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),n=JSON.stringify(t.form.questionnaire,null,2),g={title:"Question/time/with item-control/spinner/repeating/with answer-options",component:o,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:n},render:r=>s.jsx(o,{scenario:{name:"time-wc-spinner-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-spinner-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
