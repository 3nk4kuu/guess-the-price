import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import HowToPlay from './Howtoplay';

export default function Header({ difficulty, onDifficultyChange, gamesPerRound, disabled }) {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  return (
    <header className="site-header">
      <h1 className="site-title"><span>Checkout</span> <span>Champion</span></h1>
      <div className="header-controls">
        <div className="difficulty-control"><span id="difficulty-label">Difficulty</span>
          <Select className="difficulty-select" labelId="difficulty-label" value={difficulty} onChange={event => onDifficultyChange(event.target.value)} disabled={disabled} IconComponent={KeyboardArrowDownRounded}
            MenuProps={{ slotProps: { paper: { sx: { backgroundColor: '#101d29', backgroundImage: 'none', border: '1px solid #4a667b', borderRadius: '2px' } } } }}>
            <MenuItem className="difficulty-option" value="easy">Easy</MenuItem>
            <MenuItem className="difficulty-option" value="medium">Medium</MenuItem>
            <MenuItem className="difficulty-option" value="hard">Hard</MenuItem>
          </Select>
        </div>
        <button className="help-button" aria-label="How to play" onClick={() => setHowToPlayOpen(true)}>?</button>
      </div>
      <Dialog open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} aria-labelledby="how-to-play-title" maxWidth="sm" fullWidth>
        <HowToPlay gamesPerRound={gamesPerRound} onClose={() => setHowToPlayOpen(false)} />
      </Dialog>
    </header>
  );
}
