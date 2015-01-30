#!/perl/bin/perl.exe

## CREATED: 02.14.2013
## VERSION: 1.0
## AUTHOR: Howard Bates (hbates@northmen.org)
## PURPOSE: To process ski patrol incident form

use 5.14.2;
use warnings;
use Template;
use CGI qw(:standard);
use CGI::Carp qw(warningsToBrowser fatalsToBrowser);

my $OUTFILE = 'result.html';
my ($tt, $cgi, $TTVars);

sub main {
    $tt = Template->new({
        ABSOLUTE => 0,
        INCLUDE_PATH => ['../', '../tt/', 'cgi/'],
    });
    setValues();
    displayResult();
}

main();

sub displayResult {
    $tt->process($OUTFILE, $TTVars) || die $tt->error(), "\n\n";
}

sub setValues {
    $TTVars = {
        cgi => CGI->new(),
    };
}
