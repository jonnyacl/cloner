# Cloner

A react component that takes a child element and can then clone it.

## Usage

```
<Cloner
  cloneFactory={cloneFactory}
  onCloneChange={onCloneChange}
  cloneButton={myCloneButton}
>
  <ToClone
    name="OG child"
  />
</Cloner>
```

`cloneFactory`: an optional factory method to modify props on clone

`onCloneChange`: an optional callback called on clone and removal of clone

`cloneButton`: A render function for a JSX element you may want instead a raw html button for triggering cloning

`<ToClone />`: Child component. This gets cloned and passed through cloneFactory on clone.

### Available methods

`<Cloner />`: a JSX component children sit inside which is a context provider so clone context can be retrieved from in it with `useClones` hook.

`useClones`: hook to retrieve clones, and setClones. Usage:

```
import { useClones } from 'cloner';
...
function comp() {
    ...
    const { clones, setClones } = useClones();
    ...
    return (
        <Cloner>
          <div>Hi</div>
        </Cloner>
    );
}

```

`unClone`: Cloner also passes a prop to child component like an HOC called `unClone` which removes a selected clone. Use this method inside the child component to remove it with e.g. a button

## Example app

```
import React, { useEffect } from "react";
import { Cloner, useClones } from "cloner";

export default function App() {
  const cloneFactory = (Component) => {
    // do stuff with props in factory on clone
    return {
      ...Component,
      props: {
        ...Component.props,
        name: `Clone ${Math.floor(Math.random() * 10)}`,
      },
    };
  };

  const myCloneButton = () => {
    return <button>CLONEEE</button>;
  };

  return (
    <div className="App">
      <Cloner
        cloneFactory={cloneFactory}
        onCloneChange={onCloneChange}
        cloneButton={myCloneButton}
      >
        <ToClone
          name="OG child"
        />
      </Cloner>
    </div>
  );
}

const ToClone = ({ name, unClone }) => {
  const { clones } = useClones();
  useEffect(() => {
    console.log('other clones', clones);
  }, [clones]);
  return (
    <div>
      <div>{name}</div>
      <button
        onClick={() => {
          console.log("uncloning", cloneName);
          unClone();
        }}
      >
        unclone
      </button>
    </div>
  );
};

```

## Bugs

When state is added to child component, not being correctly re rendered on uncloning
