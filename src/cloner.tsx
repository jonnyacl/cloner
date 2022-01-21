import React, { useState, useEffect, useContext, useCallback } from "react";
import { IClonerContext } from "./types";

const ClonerContext: React.Context<IClonerContext> =
  React.createContext<IClonerContext>({
    clones: [],
    setClones: () => {},
  });

export const Cloner = ({
  children,
  cloneFactory,
  onCloneChange,
  cloneButton,
}: {
  children: JSX.Element;
  cloneFactory?: (component: JSX.Element) => JSX.Element;
  onCloneChange?: (clones: JSX.Element[]) => void;
  cloneButton?: () => JSX.Element;
}): JSX.Element => {
  const [clones, setClones] = useState<JSX.Element[]>([children]);
  useEffect(() => {
    console.log(
      "I am CLONER and my clones are in my state!",
      clones.map((c) => c.props.name)
    );
    onCloneChange && onCloneChange(clones);
  }, [clones]);

  const unClone = (index: number) => {
    const remaining = [...clones];
    console.log("index", index);
    console.log(
      "before splice",
      remaining.map((r) => r.props.name)
    );
    const removed = remaining.splice(index, 1);
    console.log("got rid of", removed[0].props.name);
    console.log(
      "after splice",
      remaining.map((r) => r.props.name)
    );
    setClones(remaining);
  };

  const doClone = useCallback(() => {
    if (cloneFactory) {
      setClones([...clones, cloneFactory(children)]);
    } else {
      setClones([...clones, children]);
    }
  }, [clones, children, cloneFactory]);

  return (
    <ClonerContext.Provider value={{ clones, setClones }}>
      <div>
        <div>
          {clones.map((clone, i) => {
            return {
              ...clone,
              props: { ...clone.props, unClone: () => unClone(i) },
              key: `${i + 1}`,
            };
          })}
          <p />
        </div>
        {cloneButton ? (
          <div>
            <span onClick={doClone}>{cloneButton()}</span>
          </div>
        ) : (
          <button onClick={doClone}>Clone</button>
        )}
      </div>
    </ClonerContext.Provider>
  );
};

export const useClones = (): IClonerContext => {
  return useContext<IClonerContext>(ClonerContext);
};
