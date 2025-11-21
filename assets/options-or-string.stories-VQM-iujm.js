import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"time-wc-autocomplete-repeating-options-or-string",text:"Select a time",type:"time",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrString",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),t=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/time/with item-control/autocomplete/repeating/with answer-options",component:o,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:n=>i.jsx(o,{scenario:{name:"time-wc-autocomplete-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-autocomplete-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
