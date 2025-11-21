import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"string-wc-drop-down-repeating-options-or-string",text:"Enter text",type:"string",repeats:!0,control:"drop-down",answerConstraint:"optionsOrString",answerOption:u("string",["Alpha","Bravo","Charlie"])}),e=JSON.stringify(t.form.questionnaire,null,2),w={title:"Question/string/with item-control/drop-down/repeating/with answer-options",component:o,parameters:a,argTypes:i},r={name:"options or string",args:{questionnaireSource:e},render:n=>s.jsx(o,{scenario:{name:"string-wc-drop-down-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:e})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-drop-down-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...r.parameters?.docs?.source}}};const f=["OptionsOrString"];export{r as OptionsOrString,f as __namedExportsOrder,w as default};
