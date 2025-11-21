import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"coding-woc-non-repeating-options-or-string",text:"Choose a code",type:"coding",repeats:!1,answerConstraint:"optionsOrString",answerOption:c("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/coding/without item-control/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:o},render:t=>s.jsx(n,{scenario:{name:"coding-woc-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-woc-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const y=["OptionsOrString"];export{e as OptionsOrString,y as __namedExportsOrder,f as default};
