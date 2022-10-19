import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'keyboard_cat',
  },
});

socket.emit(
  'start',
  'GAMESS',
  {
    'gms.inp':
      ' $CONTRL ICHARG=0 MULT=1 SCFTYP=RHF RUNTYP=OPTIMIZE\n' +
      '  COORD=UNIQUE MAXIT=200 NZVAR=0 DFTTYP=B3LYPV1R\n' +
      ' $END\n' +
      ' $SYSTEM MWORDS=100 $END\n' +
      ' $STATPT NSTEP=100 HSSEND=.F. $END\n' +
      ' $SCF DIRSCF=.T. $END\n' +
      ' $BASIS GBASIS=N31 NGAUSS=6 NDFUNC=1 $END\n' +
      ' $DATA\n' +
      'Winmostar\n' +
      'C1\n' +
      'O    8.0    0.0000000000    0.0000000000    0.0000000000\n' +
      'O    8.0    1.3200000000    0.0000000000    0.0000000000\n' +
      ' $END\n',
  },
  (id: string, err: string) => console.log(id, err)
);

socket.on('end', (id, res) => {
  console.log(id, res);
});
