# Mots mélés

This game is about words to search in a grid.
It first started as a personal side project, but now, I want to give it life.

## How it works

Pretty simple. You gave it a grid of letter like this
```var GRID = [
  	['S','S','S','A','U','B','A','G','N','E'],
  	['E','P','A','A','M','V','E','N','C','E'],
  	['L','U','L','M','I','R','A','M','A','S'],
  	['R','A','O','G','E','X','A','C','O','E'],
  	['A','L','N','E','G','N','A','R','O','R'],
  	['T','O','U','L','O','N','G','L','R','E'],
  	['N','D','S','T','N','U','E','I','E','Y'],
  	['I','N','P','E','E','N','I','L','D','H'],
  	['C','A','S','S','U','J','E','R','F','L'],
  	['E','B','E','L','S','I','S','S','A','C']
  ];```

And a list of words to find like this

> var words = ['AIX','APT','ARLES','AUBAGNE','AUPS','AVIGNON','BANDOL','CANNES','CASSIS','DIGNE','FREJUS','HYERES','LUNEL','MIRAMAS','NICE','ORANGE','SALON','SORGUES','TOULON','VENCE'];

And that should be it. (well, you need 2 other parameters I'm gonna get rid of.

## TODO

### v0.0.2
* diagonal detection (for now, it's only vertical and horizontal words)
* get rid of those 2 useless parameters
* better protection against user

### v0.0.3
* make a user friendly "generator"
** interface where a user can enter a grid and a list of words easily giving an output like the JS one right now

### v0.0.4
* make an automatic generator
** give it a size, it'll fetch words via an API and make the grid with those.