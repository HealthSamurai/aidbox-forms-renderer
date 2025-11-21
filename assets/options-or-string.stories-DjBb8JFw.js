import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as r,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=c({linkId:"time-wc-check-box-non-repeating-options-or-string",text:"Select a time",type:"time",repeats:!1,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("time",["08:00:00","12:30:00","18:00:00"])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/time/with item-control/check-box/non-repeating/with answer-options",component:r,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:o},render:n=>i.jsx(r,{scenario:{name:"time-wc-check-box-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-check-box-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,f as default};
