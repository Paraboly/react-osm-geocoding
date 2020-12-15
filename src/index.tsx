import React, { useState, useRef } from 'react'
import styles from './styles.module.css'

interface Props {
  placeholder?: string,
  debounce?: number,
  iconUrl?: string,
  callback?: Function,
  countrycodes?: string,
  acceptLanguage?: string
}

export interface Result {
  boundingbox: Array<string>,
  display_name: string,
  lat: string,
  lng: string
}

export class debouncedMethod<T>{
  constructor(method:T, debounceTime:number){
    this._method = method;
    this._debounceTime = debounceTime;
  }
  private _method:T;
  private _timeout:number;
  private _debounceTime:number;
  public invoke:T = ((...args:any[])=>{
    this._timeout && window.clearTimeout(this._timeout);
    this._timeout = window.setTimeout(()=>{
      (this._method as any)(...args);
    },this._debounceTime);
  }) as any;
}

const renderResults = (results: any, callback: Function | undefined, setShowResults:React.Dispatch<React.SetStateAction<boolean>>) => 
  <div className={styles.results}>
    {results.map((result: Result, index: number) => 
      <div key={index} className={styles.result} onClick={()=> {
        if(callback) {
          callback(result);
          setShowResults(false);
        }
        }}>
        {result?.display_name}
      </div>
    )}
  </div>


export const ReactOsmGeocoding = ({ placeholder = "Enter address", debounce = 2000, iconUrl = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/search-512.png", callback, countrycodes = "tr", acceptLanguage = "tr" }: Props) => {
  const [results, setResults] = useState<Partial<Result[]>>([]);
  const [showResults, setShowResults] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  
  document.addEventListener('click', function(event) {
      var isClickInside = mainContainerRef?.current?.contains(event.target as Node);
      if (!isClickInside) {
        setShowResults(false);
      }
  });

  function getGeocoding(address = "") {
    if(address.length === 0) return;

    setShowLoader(true);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}&countrycodes=${countrycodes}&accept-language=${acceptLanguage}`;

    fetch(url)
    .then(response => response.json())
    .then((data) => {
      setResults(data);
      setShowResults(true);
    })
    .catch(err =>console.warn(err))
    .finally(() => setShowLoader(false));
  }

  var debouncer = new debouncedMethod((address: string)=>{
    getGeocoding(address);
   }, debounce);



  return <div className={styles.reactOsmGeocoding} ref={mainContainerRef}>
    <input type="text" name="geocoding" id="geocoding" placeholder={placeholder} 
      onClick={() => setShowResults(true)}
      onChange={event => debouncer.invoke(event.target.value)}/>
    <img src={iconUrl} width={"30px"} height={"30px"}/>
    {showLoader && <div className={styles.loader}></div>}
    {(results.length && showResults) ? renderResults(results, callback, setShowResults) : ""}
  </div>
}
